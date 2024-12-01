import prisma from '@/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const project_id = url.searchParams.get('project_id');

    if (!project_id) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    const session: any = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Please sign in first to continue' }, { status: 401 });
    }

    const board = await prisma.project.findFirst({
      where: {
        userId: session.user.id,
        id: project_id,
      },
      include: {
        categories: {
          orderBy: {
            position: 'asc',
          },
          select: {
            id: true,
            title: true,
            position: true,
            tasks: {
              orderBy: {
                position: 'asc',
              },
              select: {
                id: true,
                name: true,
                description: true,
                priorityId: true,
                isCompleted: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    const columnMap: any = [];
    const columnIds: any = [];
    board?.categories?.forEach((category: any) => {
      columnIds.push(category.title.toLowerCase());
      const items = category.tasks.map((task: any) => ({
        ...task,
        itemId: `item-${task.id}`, // Customize itemId logic as needed
      }));

      columnMap.push({
        title: category.title,
        columnId: category.title.toLowerCase(),
        items: items,
        id: category.id,
      });
    });

    const data = {
      id: board?.id,
      name: board?.name,
      userId: board?.userId,
      columnMap: columnMap,
    };

    return NextResponse.json(
      {
        message: 'Project details fetched successfully',
        data: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
