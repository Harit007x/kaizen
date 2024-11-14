'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/sidebar/add-sidebar';

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  console.log('path =', pathname);
  const notAllowedSideBarPaths = ['/sign-in', '/sign-up', '/reset-password'];
  const showSideBar = !notAllowedSideBarPaths.includes(pathname);
  return (
    <SidebarProvider>
      <SessionProvider>
        {showSideBar && <AppSidebar />}
        {children}
      </SessionProvider>
    </SidebarProvider>
  );
}
