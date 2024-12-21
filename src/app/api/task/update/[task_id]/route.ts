import prisma from '@/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: { task_id: string } }) {
  // Validate Request
  const { task_id } = params;

  const { name, description, priorityId, dueDate } = await request.json();

  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Please sign in first to continue' }, { status: 401 });
    }

    const task = await prisma.task.update({
      where: {
        id: task_id,
      },
      data: {
        name: name,
        description: description,
        priorityId: priorityId,
        dueDate: dueDate,
        isCompleted: false,
      },
    });

    return NextResponse.json({ message: 'Task updated successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
