'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

import { ThemeProvider } from '@/components/others/theme-providers';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Providers({ children }: { children: ReactNode }) {
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
