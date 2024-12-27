import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { generateAndSendOtp } from '@/actions/sendOtp';
import prisma from '@/db';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { email, isSigningUp } = await z
    .object({ email: z.string().email(), isSigningUp: z.boolean() })
    .parseAsync(body);

  try {
    const userExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (isSigningUp) {
      if (userExist) {
        return NextResponse.json(
          { message: 'An account with this email already exists. Please log in or use a different email.' },
          { status: 409 }
        );
      }
    } else if (!userExist) {
      return NextResponse.json(
        { message: 'There is no account linked to this email, please enter correct email address.' },
        { status: 409 }
      );
    }

    const otp = await generateAndSendOtp(email);

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 1);

    if (otp) {
      await prisma.otp.upsert({
        where: {
          email: email,
        },
        update: {
          otp: otp,
          expiresAt: expirationTime,
        },
        create: {
          email: email,
          otp: otp,
          expiresAt: expirationTime,
        },
      });
    }

    if (!otp) {
      return NextResponse.json({ message: 'Failed to send otp. Check your email and try again' }, { status: 500 });
    }

    return NextResponse.json({ message: `Email sent to your ${email}` });
  } catch (error) {
    console.log('error :', error);
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

    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
