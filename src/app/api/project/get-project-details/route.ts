import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/db';
import { authOptions } from '@/lib/auth';

export interface Task {
  id: string;
  name: string;
  description: string | null;
  priorityId: string;
  dueDate: Date;
  createdAt: Date;
  isCompleted: boolean;
  itemId: string;
}

export interface ColumnData {
  title: string;
  columnId: string;
  items: Task[];
  id: string;
}

export interface ProjectDetails {
  id: string | undefined;
  name: string | null | undefined;
  userId: string | null | undefined;
  columnMap: ColumnData[];
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const project_id = url.searchParams.get('project_id');

    if (!project_id) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
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
          orderBy: { position: 'asc' },
          select: {
            id: true,
            title: true,
            position: true,
            tasks: {
              orderBy: { position: 'asc' },
              select: {
                id: true,
                name: true,
                description: true,
                dueDate: true,
                priorityId: true,
                isCompleted: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!board) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    const columnMap: ColumnData[] = board.categories.map((category) => ({
      title: category.title,
      columnId: category.title.toLowerCase(),
      id: category.id,
      items: category.tasks.map((task) => ({
        ...task,
        itemId: `item-${task.id}`,
      })),
    }));

    const data: ProjectDetails = {
      id: board.id,
      name: board.name,
      userId: board.userId,
      columnMap,
    };

    return NextResponse.json(
      {
        message: 'Project details fetched successfully',
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching project details:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
