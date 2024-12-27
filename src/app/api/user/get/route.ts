import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import prisma from '@/db';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Please sign in first to continue' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        email: true,
        isVerified: true,
        profilePicture: true,
        firstName: true,
        password: true,
      },
    });

    const isPasswordNull = user?.password === null;

    const userObjWithCustomField = {
      ...user,
      isPasswordNull,
    };

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Profile fetched successfully', data: userObjWithCustomField },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
