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
import { UserProfile } from '../sidebar/nav-secondary';
import Security from './resetPassword';

interface IProfileProps {
  profileData: UserProfile | undefined;
  fetchUserProfile: () => void;
}

export default function Profile(props: IProfileProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModified, setIsModified] = useState<boolean>(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      email: '',
      password: '',
      originalEmail: props.profileData?.email,
    },
  });

  async function handleProfileUpdate(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    try {
      const updateValues = {
        ...values,
        isEmailChanged: hasEmailChanged,
      };

      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateValues),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update the profile');
        }
        return res.json();
      });

      toast.success('Profile updated successfully');
      props.fetchUserProfile();
      setIsModified(false);
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    form.reset({
      firstName: props.profileData?.firstName,
      email: props.profileData?.email,
      originalEmail: props.profileData?.email,
    });
  }, [props.profileData, form]);

  useEffect(() => {
    const subscription = form.watch(() => {
      setIsModified(true);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const hasEmailChanged = props.profileData?.email !== form.watch('email');

  const handleReset = () => {
    form.reset({
      firstName: props.profileData?.firstName,
      email: props.profileData?.email,
      originalEmail: props.profileData?.email,
    });
    setIsModified(false);
  };

  return (
    <ScrollArea className="flex flex-col justify-between h-full w-full">
      {!props.profileData?.isPasswordNull ? (
        <div className="grid w-full max-w-sm gap-6 p-4">
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="picture" className="font-semibold">
              Photo
            </Label>
            <div className="flex items-center align-center gap-4">
              <Avatar className="h-20 w-20 rounded-full">
                <AvatarImage
                  src={props.profileData?.profilePicture as string}
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
                        <Input type="text" placeholder="Name" className="w-full" {...field} />
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
                            <Input
                              type="password"
                              placeholder="Password to confirm email change"
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
              {isModified && (
                <div className="flex items-center align-center gap-2">
                  <Button type="button" className="w-fit" variant={'ghost'} onClick={handleReset}>
                    Cancel
                  </Button>
                  <Button type="submit" className="w-fit" variant={'default'} disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update'}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>
      ) : (
        <Security profileData={props.profileData} fetchUserProfile={props.fetchUserProfile} />
      )}
    </ScrollArea>
  );
}
