'use client';

import { ChevronRight, MoreHorizontal, Plus, type LucideIcon } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
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

export function NavMain() {
  const router = useRouter();
  const { data, fetchSidebarDetails } = UseSidebarDetails();

  return (
    <SidebarGroup>
      {data && <SidebarGroupLabel className="text-xs text-foreground/70">Workspaces</SidebarGroupLabel>}
      <SidebarMenu>
        {data &&
          data.map((workspace: IWorkspace) => (
            <Collapsible key={workspace.title} asChild defaultOpen={false} className="group/collapsible">
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={workspace.title}>
                  <Icons.hash />
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

export function NavWorkspaces() {
  const router = useRouter();
  const { data, fetchSidebarDetails } = UseSidebarDetails();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {data &&
            data.map((workspace: IWorkspace) => (
              <Collapsible key={workspace.title}>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <Icons.folderKanban />
                      <span>{workspace.title}</span>
                    </a>
                  </SidebarMenuButton>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction
                      className="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
                      showOnHover
                    >
                      <ChevronRight />
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <SidebarMenuAction showOnHover>
                    <CreateProject workspace_id={workspace.id} fetchSidebarDetails={fetchSidebarDetails} />
                  </SidebarMenuAction>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {workspace.projects.map((project: IProjects) => (
                        <SidebarMenuSubItem
                          className="cursor-pointer"
                          key={project.name}
                          onClick={() => router.push(`/project/${project.id}`)}
                        >
                          <SidebarMenuSubButton asChild>
                            <span>{project.name}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
