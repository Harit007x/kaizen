'use client';
import { userStore } from '@/store';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const SessionChange = () => {
  const session = useSession();
  const { setUserData } = userStore();
  // console.log('session change =', session?.data?.user)
  useEffect(() => {
    const user: any = session.data?.user;
    console.log('user -', user);
    if (user) {
      setUserData(user);
    }
  }, [session]);
  // if (session.status === 'loading') {
  //     return(
  //         <main className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center ">
  //             <Icons.spinner className="mr-2 h-8 w-8 animate-spin" />
  //         </main>
  //     )
  // }
  return null;
};

export default SessionChange;
