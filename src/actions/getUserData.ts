import { Session } from 'next-auth';

import prisma from '@/db';

export async function getUserData(session: Session | null) {
  if (!session?.user) {
    return null;
  }
  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
  });

  if (!user) {
    return null;
  }

  return user;
}
