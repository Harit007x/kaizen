import prisma from '@/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { category_id: string } }) {
  // Validate Request
  const { category_id } = params;

  const { name, description } = await request.json();

  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Please sign in first to continue' }, { status: 401 });
    }
    console.log('server call =', name, description, category_id);

    const previous_task_count = await prisma.task.count({
      where: {
        categoryId: category_id,
      },
    });

    const category = await prisma.task.create({
      data: {
        categoryId: category_id,
        name: name,
        description: description,
        priority: '',
        isCompleted: false,
        position: (previous_task_count + 1) * 10,
      },
    });

    return NextResponse.json({ message: 'Task created successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
