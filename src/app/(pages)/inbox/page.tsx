import React from 'react';

import { getServerSession } from 'next-auth';
import { Session } from 'next-auth';

import prisma from '@/db';
import { authOptions } from '@/lib/auth';

import Kanban from '@/components/others/kanban';

export default async function InboxPage() {
  const session = (await getServerSession(authOptions)) as Session;

  const inbox = await prisma.project.findUnique({
    where: {
      userId_name: {
        userId: session?.user?.id,
        name: 'Inbox',
      },
    },
  });
  return <Kanban projectId={inbox?.id as string} />;
}
