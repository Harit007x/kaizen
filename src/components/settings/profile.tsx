'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Form, FormField, FormItem, FormControl, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '@/zod/profile';
import { toast } from 'sonner';
import { headers } from 'next/headers';

interface UserProfile {
  email: string;
  isVerified: string;
  profilePicture: string;
  firstName: string;
}

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>();
  const [isModified, setIsModified] = useState<boolean>(false);
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

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      email: '',
      password: '',
    },
  });

  async function handleProfileUpdate(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update the profile');
        }
        return res.json();
      });
      console.log('check the data =', response);
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    form.reset(profileData);
  }, [profileData, form]);

  useEffect(() => {
    const subscription = form.watch(() => {
      setIsModified(true);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // useEffect(()=>{})

  const hasEmailChanged = profileData?.email !== form.watch('email');

  const handleReset = () => {
    form.reset(profileData);
  };

  return (
    <ScrollArea className="flex flex-col justify-between h-full w-full">
      <div className="grid w-full max-w-sm gap-6 p-4">
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label htmlFor="picture" className="font-semibold">
            Photo
          </Label>
          <div className="flex items-center align-center gap-4">
            <Avatar className="h-20 w-20 rounded-full">
              <AvatarImage
                src={profileData?.profilePicture as string}
                alt="User Avatar"
                style={{ width: '100%', height: '100%' }}
              />
              <AvatarFallback className="rounded-lg">{}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start gap-1 text-xs">
              <div className="flex gap-2">
                <Button className="w-fit" variant={'outline'} size={'sm'}>
                  Change photo
                </Button>
                <Button className="w-fit" variant={'destructive'} size={'sm'}>
                  Remove Photo
                </Button>
              </div>
              <div className="col-span-2 text-foreground/50">Pick a photo up to 4MB.</div>
            </div>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleProfileUpdate)} className="space-y-5">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="name" className="font-semibold">
                Name
              </Label>
              <FormField
                control={form.control}
                name="firstName"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="firstName" placeholder="Name" className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="email" className="font-semibold">
                Email
              </Label>
              <FormField
                control={form.control}
                name="email"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="email" placeholder="Email" className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {hasEmailChanged && (
                <div className="grid w-full max-w-sm items-center gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    disabled={isLoading}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="password" placeholder="Enter your password" className="w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {/* <Button className="w-[30%]" variant={'outline'}>
                Change email
              </Button> */}
            </div>
            {isModified && (
              <div className="flex items-center align-center gap-2">
                <Button type="button" className="w-fit" variant={'ghost'} onClick={() => handleReset()}>
                  Cancel
                </Button>
                <Button type="submit" className="w-fit" variant={'default'}>
                  Update
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
}
