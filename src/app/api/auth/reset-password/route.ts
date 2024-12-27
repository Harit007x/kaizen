import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import prisma from '@/db';
import { authOptions } from '@/lib/auth';
import { Session } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session;
    if (!session?.user) {
      return NextResponse.json({ message: 'Please sign in first to continue' }, { status: 401 });
    }
    const { hashedPassword } = await request.json();

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      {
        message: 'Password has been updated successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during decryption:', error);

    return NextResponse.json(
      {
        message: 'Something went wrong',
        error: error,
      },
      { status: 500 }
    );
  }
}
