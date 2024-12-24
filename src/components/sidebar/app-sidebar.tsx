'use client';

import * as React from 'react';

import { NavWorkspaces } from '@/components/sidebar/nav-workspaces';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { NavUser } from './nav-user';
import { NavProjects } from './new-projects';
import { sidebarData } from '@/constants/sidebar-data';
import { SettingsDialog } from './nav-secondary';
import { Separator } from '../ui/separator';
import { UseSidebarDetails } from '@/hooks/useSidebarDetails';
import { useEffect } from 'react';

const CustomSeparator = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <Separator className="bg-secondary w-[90%]" />
    </div>
  );
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, fetchSidebarDetails } = UseSidebarDetails();

  useEffect(() => {
    fetchSidebarDetails();
  }, []);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex justify-center items-center">
          <NavUser fetchSidebarDetails={fetchSidebarDetails} />
        </div>
      </SidebarHeader>
      <Separator className="bg-secondary" />
      <SidebarContent>
        <NavProjects projects={sidebarData.projects} />
        <CustomSeparator />
        <NavWorkspaces data={data} fetchSidebarDetails={fetchSidebarDetails} />
        <CustomSeparator />
        <SettingsDialog />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
