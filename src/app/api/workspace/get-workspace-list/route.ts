import { NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';

import prisma from '@/db';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = (await getServerSession(authOptions)) as Session;

  if (!session?.user) {
    return NextResponse.json({ message: 'Please sign in first to continue' }, { status: 401 });
  }
  const userId = session.user.id;
  const excludedWorkspaces = ['Inbox'];

  try {
    const workspace_list = await prisma.workspace.findMany({
      where: {
        userWorkspaces: {
          some: {
            userId: userId,
          },
        },
        NOT: {
          title: {
            in: excludedWorkspaces,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Workspace list fetched successfully',
        data: workspace_list,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
