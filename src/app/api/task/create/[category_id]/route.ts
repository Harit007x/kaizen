import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';

import prisma from '@/db';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { category_id: string } }) {
  // Validate Request
  const { category_id } = params;

  const { name, description, priorityId, dueDate } = await request.json();

  try {
    const session = (await getServerSession(authOptions)) as Session;
    if (!session?.user) {
      return NextResponse.json({ message: 'Please sign in first to continue' }, { status: 401 });
    }
    console.log('server call =', name, description, category_id);

    const maxPositionTask = await prisma.task.findFirst({
      where: {
        categoryId: category_id,
      },
      orderBy: {
        position: 'desc',
      },
      take: 1,
    });

    let position;

    if (!maxPositionTask) {
      position = 1000;
    } else {
      position = maxPositionTask.position + 1000;
    }

    await prisma.task.create({
      data: {
        categoryId: category_id,
        name: name,
        description: description,
        dueDate: dueDate,
        priorityId: priorityId ? priorityId : 'p4',
        isCompleted: false,
        position: position,
      },
    });

    return NextResponse.json({ message: 'Task created successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
