'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Profile from '../settings/profile';
import ResetPassword from '../settings/resetPassword';
import { Separator } from '../ui/separator';
import { Icons } from '../ui-extended/icons';

export interface UserProfile {
  email: string;
  isVerified: string;
  profilePicture: string;
  firstName: string;
  isPasswordNull: boolean;
}

export function SettingsDialog() {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | undefined>();

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setProfileData(data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUserProfile();
    }
  }, [open]);

  const Wrapper = ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div className="flex flex-col mt-0 p-0 w-full">
      <div className="text-sm font-semibold h-fit p-4">{title}</div>
      <Separator />
      {children}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex align-center items-center gap-2 hover:bg-accent py-1.5 px-2 mx-2 rounded-md text-sm cursor-pointer">
          <Icons.settings className="w-4 h-4" />
          <span>Settings</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-[60%] overflow-hidden p-0 min-h-[70%]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">Customize your settings here.</DialogDescription>
        {isLoading ? (
          'Loading...'
        ) : (
          <div className="flex flex-col gap-3 w-full h-full">
            <Tabs defaultValue="profile" className="flex flex-row w-full h-full">
              <TabsList className="w-full h-full">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              {profileData && (
                <>
                  <TabsContent value="profile" className="w-full">
                    <Wrapper title="Profile">
                      <Profile profileData={profileData} fetchUserProfile={fetchUserProfile} />
                    </Wrapper>
                  </TabsContent>
                  <TabsContent value="security" className="w-full">
                    <Wrapper title="Security">
                      <ResetPassword profileData={profileData} fetchUserProfile={fetchUserProfile} />
                    </Wrapper>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
