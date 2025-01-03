'use client';

import { useState } from 'react';

import { BadgeCheck, ChevronsUpDown, LogOut, Sparkles } from 'lucide-react';
import { signOut } from 'next-auth/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { userStore } from '@/store';

import CreateWorkspace from '../others/create-workspace';
import { Icons } from '../ui-extended/icons';

interface INavUserProps {
  fetchSidebarDetails: () => Promise<void>;
}

export function NavUser(props: INavUserProps) {
  const { isMobile } = useSidebar();
  const { user } = userStore();

  const [isWorkspaceDialogOpen, setIsWorkspaceDialogOpen] = useState<boolean>(false);

  return (
    user && (
      <SidebarMenu>
        <SidebarMenuItem>
          <CreateWorkspace
            setIsWorkspaceDialogOpen={setIsWorkspaceDialogOpen}
            isWorkspaceDialogOpen={isWorkspaceDialogOpen}
            fetchSidebarDetails={props.fetchSidebarDetails}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.profilePicture} alt="User Avatar" style={{ width: '100%', height: '100%' }} />

                  <AvatarFallback className="rounded-lg">{user.firstName[0]}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left pl-1 text-sm leading-tight">
                  <span className="truncate font-semibold">{user.firstName}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] rounded-lg"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.profilePicture} alt={user.firstName} />
                    <AvatarFallback className="rounded-lg">{user.firstName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.firstName}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem disabled={true}>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setIsWorkspaceDialogOpen(true);
                  }}
                >
                  <Icons.plus className="w-4 h-4" />
                  Add workspace
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <CreditCard />
                  Billing
                </DropdownMenuItem> */}
                <DropdownMenuItem>
                  <Icons.settings className="w-4 h-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  );
}
