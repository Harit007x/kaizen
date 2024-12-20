import prisma from '@/db';
import { authOptions } from '@/lib/auth';
import { compare } from 'bcrypt';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const { firstName, email, password } = await request.json();
    const session: any = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Please sign in first to continue' }, { status: 401 });
    }

    if (password) {
      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });

      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      const isPasswordMatch = await compare(password, user.password as string);

      if (!isPasswordMatch) {
        return NextResponse.json({ message: 'Incorrect password. Please type a valid password.' });
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          email,
        },
      });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName: firstName,
      },
    });

    return NextResponse.json({ message: 'Profile updated successfully', data: {} }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
