'use client';

import * as React from 'react';

import { NavMain } from '@/components/sidebar/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { NavUser } from './nav-user';
import { NavProjects } from './new-projects';
import { sidebarData } from '@/constants/sidebar-data';

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex justify-center items-center">
          <NavUser />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={sidebarData.projects} />
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
