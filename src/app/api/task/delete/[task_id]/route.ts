import prisma from '@/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest, { params }: { params: { task_id: string } }) {
  // Validate Request
  const { task_id } = params;

  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Please sign in first to continue' }, { status: 401 });
    }

    const task = await prisma.task.delete({
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
