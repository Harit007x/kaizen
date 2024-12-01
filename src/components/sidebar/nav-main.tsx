'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { UseSidebarDetails } from '@/hooks/useSidebarDetails';
import { Icons } from '../icons';
import CreateProject from '../others/create-project';
import { useRouter } from 'next/navigation';

export interface IProjects {
  id: string;
  name: string;
}

export interface IWorkspace {
  id: string;
  title: string;
  projects: IProjects[];
}

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const router = useRouter();
  const { data, fetchSidebarDetails } = UseSidebarDetails();

  return (
    <SidebarGroup>
      {data && <SidebarGroupLabel className="font-bold text-sm text-gray-600">Workspaces</SidebarGroupLabel>}
      <SidebarMenu>
        {data &&
          data.map((workspace: IWorkspace) => (
            <Collapsible key={workspace.title} asChild defaultOpen={false} className="group/collapsible">
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={workspace.title}>
                  <Icons.hash className="text-gray-500" />
                  <span>{workspace.title}</span>
                  <div className="flex items-center justify-center ml-auto h-4 gap-3">
                    <CreateProject workspace_id={workspace.id} fetchSidebarDetails={fetchSidebarDetails} />
                    {workspace.projects.length > 0 && (
                      <CollapsibleTrigger asChild>
                        <ChevronRight className="w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </CollapsibleTrigger>
                    )}
                  </div>
                </SidebarMenuButton>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {workspace.projects.map((project) => (
                      <SidebarMenuSubItem key={project.name} onClick={() => router.push(`/project/${project.id}`)}>
                        <SidebarMenuSubButton asChild>
                          {/* <a href={project.url}> */}
                          {/* <item.icon className="text-gray-500" /> */}
                          <span className="cursor-pointer">{project.name}</span>
                          {/* </a> */}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
