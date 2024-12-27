import { genSalt, hash } from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import prisma from '@/db';
import { forgotPasswordSchema } from '@/zod/user';

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log('body =', body);
  const { email, newPassword, otp } = await forgotPasswordSchema.parseAsync(body);

  if (!email || !newPassword || !otp) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  try {
    const storedOtp = await prisma.otp.findUnique({
      where: {
        email,
        otp,
      },
    });

    if (!storedOtp) {
      return NextResponse.json({ message: 'The entered OTP is incorrect. Please try again.' }, { status: 500 });
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(newPassword, salt);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: 'Your password has been reset successfully.' }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      const formattedMessage = (() => {
        if (fieldErrors.email) {
          return fieldErrors.email[0];
        }
        if (fieldErrors.password) {
          return fieldErrors.password[0];
        }
        if (fieldErrors.otp) {
          return fieldErrors.otp[0];
        }
        return 'Something went wrong';
      })();
      return NextResponse.json({ message: formattedMessage }, { status: 400 });
    }

    if (error instanceof Error && error.message === 'Email already registered') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
