import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';

import prisma from '@/db';
import { authOptions } from '@/lib/auth';

export async function DELETE(request: NextRequest) {
  // Validate Request

  try {
    const url = new URL(request.url);
    const task_id = url.pathname.split('/').pop();

    if (!task_id) {
      return NextResponse.json({ message: 'Task ID is required' }, { status: 400 });
    }

    const session = (await getServerSession(authOptions)) as Session;
    if (!session?.user) {
      return NextResponse.json({ message: 'Please sign in first to continue' }, { status: 401 });
    }

    await prisma.task.delete({
      where: {
        id: task_id,
      },
    });

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
