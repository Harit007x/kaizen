'use client';
import { useEffect } from 'react';

import { useSession } from 'next-auth/react';

import { userStore } from '@/store';

const SessionChange = () => {
  const session = useSession();
  const { setUserData } = userStore();
  // console.log('session change =', session?.data?.user)
  useEffect(() => {
    const user = session.data?.user;
    if (user) {
      setUserData({
        id: user.id || '',
        firstName: user.firstName || '',
        email: user.email || '',
        profilePicture: user.profilePicture || '',
      });
    }
  }, [session, setUserData]);

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
