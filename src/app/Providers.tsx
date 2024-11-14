'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/sidebar/add-sidebar';
import { ThemeProvider } from '@/components/others/theme-providers';

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  console.log('path =', pathname);
  const notAllowedSideBarPaths = ['/sign-in', '/sign-up', '/reset-password'];
  const showSideBar = !notAllowedSideBarPaths.includes(pathname);
  return (
    <SidebarProvider>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {showSideBar && <AppSidebar />}
          {children}
        </ThemeProvider>
      </SessionProvider>
    </SidebarProvider>
  );
}
