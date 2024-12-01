import React from 'react';
import Kanban from '@/components/others/kanban';
import prisma from '@/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function InboxPage() {
  const session: any = await getServerSession(authOptions);

  const inbox = await prisma.project.findUnique({
    where: {
      userId_name: {
        userId: session?.user?.id,
        name: 'Inbox',
      },
    },
  });
  console.log('chekc the inxov =', session?.user);
  return <Kanban projectId={inbox?.id as string} />;
}
