import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import prisma from '@/db';
import { authOptions } from '@/lib/auth';
import { Session } from 'next-auth';

export async function POST(request: NextRequest) {
  // Validate Request
  const formData = await request.formData();
  const name = formData.get('category_name') as string;
  const project_id = formData.get('project_id') as string;
  if (!name) {
    return NextResponse.json({ message: 'Name is required' }, { status: 400 });
  }

  try {
    const session = (await getServerSession(authOptions)) as Session;
    console.log('session on server= ', session?.user, formData);
    if (!session?.user) {
      return NextResponse.json({ message: 'Please sign in first to continue' }, { status: 401 });
    }

    const maxPositionTask = await prisma.category.findFirst({
      where: {
        projectId: project_id,
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

    await prisma.category.create({
      data: {
        projectId: project_id,
        title: name,
        position: position,
      },
    });

    return NextResponse.json({ message: 'Category created successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
