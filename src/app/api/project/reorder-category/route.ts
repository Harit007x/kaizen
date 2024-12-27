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

    const { projectId, source_column_id, destination_column_id } = await request.json();

    let new_position: number = 0;

    const categories = await prisma.category.findMany({
      where: {
        projectId: projectId,
      },
      orderBy: {
        position: 'asc',
      },
    });
    console.log('source id dest id =', source_column_id, destination_column_id);
    const source_category = categories.find((category) => category.id === source_column_id);
    const destination_category = categories.find((category) => category.id === destination_column_id);

    console.log('sour category dest cate', source_category, destination_category);

    if (!destination_category || !source_category) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    const source_index = categories.findIndex((category) => category.id === source_column_id);
    const destination_index = categories.findIndex((category) => category.id === destination_category.id);
    // check if there is anything above the destination item
    console.log('destination index =', destination_index, source_category.position, destination_category.position);
    if (destination_index === 0) {
      console.log('above ----');
      new_position = destination_category.position / 2;
    } else if (destination_index === categories.length - 1) {
      // check if there is anything below the destination item
      console.log('below ----');
      new_position = (destination_category.position * 2 + 1000) / 2;
    } else if (source_category.position > destination_category.position) {
      // check if in between
      console.log('between above ----');

      // console.log('destination - - - - - - -', destination_category)
      const itemAboveDestination = categories[destination_index - 1];

      if (!itemAboveDestination) {
        return NextResponse.json({ message: 'Invalid position' }, { status: 400 });
      }
      // console.log('ism aboe =', itemAboveDestination)
      new_position = (destination_category.position + itemAboveDestination?.position) / 2;
      // console.log('source position =', new_position)
    } else if (source_category.position < destination_category.position) {
      console.log('between below ----');
      const itemBelowDestination = categories[destination_index + 1];
      if (!itemBelowDestination) {
        return NextResponse.json({ message: 'Invalid position' }, { status: 400 });
      }
      new_position = (destination_category.position + itemBelowDestination?.position) / 2;
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    const conflict = categories.some((category) => category.position === new_position);

    if (conflict || project?.reorderThreshold === 20) {
      console.log('conflicting cases - - - - - - - - -');

      categories.splice(source_index, 1);
      categories.splice(destination_index, 0, source_category);

      const resetCategoryPositions = categories.map((category, index) => {
        return prisma.category.update({
          where: {
            id: category.id,
            projectId: projectId,
          },
          data: {
            position: 1000 * (index + 1),
          },
        });
      });

      await Promise.all(resetCategoryPositions);

      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: { reorderThreshold: 0 },
      });

      return NextResponse.json({ message: 'Category positions updated successfully' }, { status: 200 });
    }

    await prisma.project.update({
      where: {
        id: projectId,
      },
      data: { reorderThreshold: { increment: 1 } },
    });

    await prisma.category.update({
      where: { id: source_category.id },
      data: { position: new_position },
    });

    return NextResponse.json({ message: 'Category positions updated successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
