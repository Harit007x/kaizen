import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';

import prisma from '@/db';
import { authOptions } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session;
    if (!session?.user) {
      return NextResponse.json({ message: 'Please sign in first to continue' }, { status: 401 });
    }

    const { category_id, source_task_id, destination_task_id } = await request.json();
    let new_position: number = 0;

    const tasks = await prisma.task.findMany({
      where: {
        categoryId: category_id,
      },
      orderBy: {
        position: 'asc',
      },
    });

    // let isMovedBelow;
    // let isMovedAbove;
    const source_task = tasks.find((task) => task.id === source_task_id);
    const destination_task = tasks.find((task) => task.id === destination_task_id);
    if (!source_task || !destination_task) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }
    const destination_index = tasks.findIndex((task) => task.id === destination_task.id);
    const source_index = tasks.findIndex((task) => task.id === source_task.id);
    // check if there is anything above the destination item
    if (destination_index === 0) {
      // isMovedAbove = false;
      new_position = destination_task.position / 2;
    } else if (destination_index === tasks.length - 1) {
      // isMovedBelow = false;
      new_position = (destination_task.position * 2 + 1000) / 2;
    } else if (source_task.position > destination_task.position) {
      const itemAboveDestination = tasks[destination_index - 1];
      if (!itemAboveDestination) {
        return NextResponse.json({ message: 'Invalid position' }, { status: 400 });
      }
      // console.log('ism aboe =', itemAboveDestination)
      new_position = (destination_task.position + itemAboveDestination?.position) / 2;
      // console.log('source position =', new_position)
    } else if (source_task.position < destination_task.position) {
      const itemBelowDestination = tasks[destination_index + 1];

      if (!itemBelowDestination) {
        return NextResponse.json({ message: 'Invalid position' }, { status: 400 });
      }
      new_position = (destination_task.position + itemBelowDestination?.position) / 2;
    }

    const reorderThresholdHit = await prisma.category.findUnique({ where: { id: category_id } });
    const conflict = tasks.some((task) => task.position === new_position);

    if (conflict || reorderThresholdHit?.reorderThreshold === 20) {
      console.log('conflicting cases - - - - - - - - -', destination_index);
      tasks.splice(source_index, 1);
      tasks.splice(destination_index, 0, source_task);

      const resetTaskPositions = tasks.map((task, index) => {
        return prisma.task.update({
          where: {
            id: task.id,
            categoryId: category_id,
          },
          data: {
            position: 1000 * (index + 1),
          },
        });
      });

      await Promise.all(resetTaskPositions);

      await prisma.category.update({
        where: {
          id: category_id,
        },
        data: { reorderThreshold: 0 },
      });

      return NextResponse.json({ message: 'Task positions updated successfully' }, { status: 200 });
    }

    await prisma.task.update({
      where: { id: source_task.id },
      data: { position: new_position },
    });

    await prisma.category.update({
      where: {
        id: category_id,
      },
      data: { reorderThreshold: { increment: 1 } },
    });

    return NextResponse.json({ message: 'Task positions updated successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
