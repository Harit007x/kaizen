import prisma from '@/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Validate Request
  const { title } = await request.json();
  if (!title) {
    return NextResponse.json({ message: 'Title is required' }, { status: 400 });
  }

  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Please sign in first to continue' }, { status: 401 });
    }

    const user_id = session.user.id;

    const workspace = await prisma.workspace.create({
      data: {
        title: title,
        userWorkspaces: {
          create: {
            userId: user_id,
          },
        },
      },
    });

    return NextResponse.json({ message: 'Workspace created successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
