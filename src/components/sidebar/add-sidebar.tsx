'use client';

import * as React from 'react';

import { NavWorkspaces } from '@/components/sidebar/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { NavUser } from './nav-user';
import { NavProjects } from './new-projects';
import { sidebarData } from '@/constants/sidebar-data';
import { SettingsDialog } from './nav-secondary';
import { Separator } from '../ui/separator';

const CustomSeparator = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <Separator className="bg-secondary w-[90%]" />
    </div>
  );
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex justify-center items-center">
          <NavUser />
        </div>
      </SidebarHeader>
      <Separator className="bg-secondary" />
      <SidebarContent>
        <NavProjects projects={sidebarData.projects} />
        <CustomSeparator />
        <NavWorkspaces />
        <CustomSeparator />

        {/* <NavWorkspaces workspaces={sidebarData.workspaces}/> */}
        <SettingsDialog />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
