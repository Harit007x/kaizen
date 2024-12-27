import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import prisma from '@/db';
import { authOptions } from '@/lib/auth';

import { Session } from 'next-auth';

export async function DELETE(request: NextRequest, { params }: { params: { category_id: string } }) {
  // Validate Request
  const { category_id } = params;

  try {
    const session = (await getServerSession(authOptions)) as Session;
    if (!session?.user) {
      return NextResponse.json({ message: 'Please sign in first to continue' }, { status: 401 });
    }

    const tasksExist = await prisma.task.findFirst({
      where: {
        categoryId: category_id,
      },
    });

    console.log('wow ",', tasksExist);

    if (tasksExist) {
      await prisma.task.deleteMany({
        where: {
          categoryId: category_id,
        },
      });
    }

    await prisma.category.delete({
      where: {
        id: category_id,
      },
    });

    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
