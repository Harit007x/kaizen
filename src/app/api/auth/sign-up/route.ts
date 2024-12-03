import OnboardingTemplate from '@/components/emailTemplates/OnboardingTemplate';
import prisma from '@/db';
import { sendMail } from '@/lib/resend';
import { signUpSchema } from '@/zod/user';
import { User } from '@prisma/client';
import { genSalt, hash } from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  const extendedSchema = signUpSchema.extend({
    otp: z.string().min(1, 'OTP is required'),
  });
  try {
    // Validate Request
    const body = await request.json();
    const { email, password, firstName, lastName, otp } = await extendedSchema.parseAsync(body);

    const storedOtp = await prisma.otp.findUnique({
      where: {
        email,
        otp,
      },
    });

    if (!storedOtp) {
      return NextResponse.json({ message: 'The entered OTP is incorrect. Please try again.' }, { status: 500 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);
      const user = await tx.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
          isVerified: true,
        },
      });

      const newAccount = await tx.account.create({
        data: {
          provider: 'EMAIL',
          userId: user.id,
        },
      });

      await tx.workspace.create({
        data: {
          title: 'My Projects',
          userWorkspaces: {
            create: {
              userId: user.id,
            },
          },
        },
      });

      const defaultWorkspace = await tx.workspace.create({
        data: {
          title: 'Inbox',
          userWorkspaces: {
            create: {
              userId: user.id,
            },
          },
        },
      });

      await tx.project.create({
        data: {
          workspaceId: defaultWorkspace.id,
          userId: user.id,
          name: 'Inbox',
        },
      });

      await tx.otp.delete({
        where: {
          email,
          otp,
        },
      });

      return { user, newAccount };
    });

    if (!result) {
      return NextResponse.json({ message: 'Failed to create account' }, { status: 500 });
    }

    await sendMail(email, 'Welcome to Kaizen', OnboardingTemplate());

    return NextResponse.json(
      { message: 'Welcome aboard! Your account has been successfully created.' },
      { status: 201 }
    );
  } catch (error) {
    console.log('error: ', error);
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      const formattedMessage = (() => {
        const firstErrorKey = Object.keys(fieldErrors)[0];
        if (!firstErrorKey) return 'Invalid input';

        const firstError = fieldErrors[firstErrorKey]?.[0];
        if (firstError === 'Required') {
          return `${firstErrorKey.charAt(0).toUpperCase()}${firstErrorKey.slice(1)} is required`;
        }
        return firstError || 'Invalid input';
      })();

      return NextResponse.json({ message: formattedMessage }, { status: 400 });
    }

    if (error instanceof Error && error.message === 'Email already registered') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
