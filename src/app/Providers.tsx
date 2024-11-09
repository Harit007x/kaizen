"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar"
import SideBar from "@/components/add-sidebar";
import { usePathname } from "next/navigation";

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  console.log('path =', pathname)
  const notAllowedSideBarPaths = ['/sign-in', '/sign-up', '/reset-password']
  const showSideBar = !notAllowedSideBarPaths.includes(pathname)
  return (
    <SidebarProvider>
      <SessionProvider>
        {showSideBar && <SideBar/>}
        {children}
      </SessionProvider>
    </SidebarProvider>
  )
}
