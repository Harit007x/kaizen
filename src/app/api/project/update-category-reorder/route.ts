import prisma from '@/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Please sign in first to continue' }, { status: 401 });
    }

    const { projectId, source_column_id, destination_column_id } = await request.json();

    let source_position;

    const categories = await prisma.category.findMany({
      where: {
        projectId: projectId,
      },
      orderBy: {
        position: 'asc',
      },
    });
    const source_category = categories.find((category) => category.id === source_column_id);
    const destination_category = categories.find((category) => category.id === destination_column_id);

    if (!destination_category || !source_category) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    let destination_index = categories.findIndex((category) => category.position === destination_category.position);
    // check if there is anything above the destination item
    if (destination_index === 0) {
      source_position = destination_category.position / 2;
    }

    // check if there is anything below the destination item
    if (destination_index === categories.length - 1) {
      source_position = (destination_category.position * 2 + 10) / 2;
    }

    // check if in between
    const isMovedAbove = source_category.position > destination_category.position;
    if (isMovedAbove) {
      // console.log('destination - - - - - - -', destination_category)
      const destination_index = categories.findIndex((category) => category.position === destination_category.position);
      const itemAboveDestination = categories[destination_index - 1];

      if (!itemAboveDestination) {
        return NextResponse.json({ message: 'Invalid position' }, { status: 400 });
      }
      // console.log('ism aboe =', itemAboveDestination)
      source_position = (destination_category.position + itemAboveDestination?.position) / 2;
      // console.log('source position =', source_position)
    }

    const isMovedBelow = source_category.position < destination_category.position;
    if (isMovedBelow) {
      const destination_index = categories.findIndex((category) => category.position === destination_category.position);
      const itemBelowDestination = categories[destination_index + 1];
      if (!itemBelowDestination) {
        return NextResponse.json({ message: 'Invalid position' }, { status: 400 });
      }
      source_position = (destination_category.position + itemBelowDestination?.position) / 2;
    }

    await prisma.category.update({
      where: { id: source_category.id },
      data: { position: source_position },
    });

    return NextResponse.json({ message: 'Category positions updated successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
