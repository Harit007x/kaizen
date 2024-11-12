import prisma from '@/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const session: any = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: 'Please sign in first to continue' }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const workspace_list = await prisma.workspace.findMany({
      where: {
        userWorkspaces: {
          some: {
            userId: userId,
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
