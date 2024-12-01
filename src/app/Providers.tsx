'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/others/theme-providers';

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const notAllowedSideBarPaths = ['/login', '/signup', '/forgot-password'];
  const showSideBar = !notAllowedSideBarPaths.includes(pathname);
  return (
    <SidebarProvider>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </SessionProvider>
    </SidebarProvider>
  );
}
