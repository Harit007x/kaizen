'use client';

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '../icons';
import { Separator } from '../ui/separator';
import Profile from '../settings/profile';
import Security from '../settings/security';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
export function SettingsDialog() {
  const [open, setOpen] = React.useState(false);

  const Wrapper: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
    return (
      <div className="flex flex-col mt-0 p-0 w-full">
        <div className="text-base font-semibold h-fit p-4">{title}</div>
        <Separator />
        {children}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex align-center items-center gap-2 hover:bg-accent py-1.5 px-2 mx-2 rounded-md text-sm cursor-pointer">
          <Icons.settings className="w-4 h-4" />
          <span>Settings</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-[60%] overflow-hidden p-0 min-h-[80%]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">Customize your settings here.</DialogDescription>

        <div className="flex flex-col gap-3 w-full h-full">
          <Tabs defaultValue="profile" className="flex flex-row w-full h-full">
            <TabsList className="w-full h-full">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="w-full">
              <Wrapper title={'Profile'}>
                <Profile />
              </Wrapper>
            </TabsContent>
            <TabsContent value="security" className="w-full">
              <Wrapper title={'Security'}>
                <Security />
              </Wrapper>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
