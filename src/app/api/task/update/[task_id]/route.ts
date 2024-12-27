import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';

import prisma from '@/db';
import { authOptions } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { task_id: string } }) {
  // Validate Request
  const { task_id } = params;

  const { name, description, priorityId, dueDate } = await request.json();

  try {
    const session = (await getServerSession(authOptions)) as Session;
    if (!session?.user) {
      return NextResponse.json({ message: 'Please sign in first to continue' }, { status: 401 });
    }

    await prisma.task.update({
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
