'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';

interface UserProfile {
  email: string;
  isVerified: string;
  profilePicture: string;
  firstName: string;
}

export default function Security() {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>();
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch workspace list');
        }
        return res.json();
      });
      setProfileData(response.data);
      console.log('ok =', response);
    } catch (error) {
      console.log('error: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <ScrollArea className="h-[calc(70vh-4rem)] w-full p-4">
      <div className="flex flex-col gap-3">
        <Label className="font-semibold">Change password</Label>
        <div className="grid w-full max-w-sm gap-4 pb-6">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Input id="picture" type="password" placeholder="Current password" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Input id="email" type="password" placeholder="New password" />
          </div>
        </div>
      </div>
      <div className="flex items-center align-center gap-2">
        <Button className="w-fit" variant={'ghost'}>
          Cancel
        </Button>
        <Button className="w-fit" variant={'default'}>
          Update
        </Button>
      </div>
    </ScrollArea>
  );
}
