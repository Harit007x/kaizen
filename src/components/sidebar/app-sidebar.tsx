'use client';

import * as React from 'react';
import { useEffect } from 'react';

import { NavWorkspaces } from '@/components/sidebar/nav-workspaces';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { sidebarData } from '@/constants/sidebar-data';
import { UseSidebarDetails } from '@/hooks/useSidebarDetails';

import { SettingsDialog } from './nav-secondary';
import { NavUser } from './nav-user';
import { NavProjects } from './new-projects';
import { Separator } from '../ui/separator';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
