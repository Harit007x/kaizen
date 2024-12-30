'use client';

import { useEffect, useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { profileSchema } from '@/zod/profile';
import Security from './resetPassword';
import { UserProfile } from '../sidebar/nav-secondary';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Form, FormField, FormItem, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';

interface IProfileProps {
  profileData: UserProfile;
  fetchUserProfile: () => void;
}

export default function Profile({ profileData, fetchUserProfile }: IProfileProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModified, setIsModified] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profileData?.firstName || '',
      email: profileData?.email || '',
      password: '',
      originalEmail: profileData?.email,
    },
  });

  const handleProfileUpdate = async (values: z.infer<typeof profileSchema>) => {
    setIsLoading(true);
    try {
      const hasEmailChanged = profileData?.email !== values.email;
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
      });

      if (!response.ok) {
        throw new Error('Failed to update the profile');
      }

      await response.json();
      toast.success('Profile updated successfully');
      fetchUserProfile();
      setIsModified(false);
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    form.reset({
      firstName: profileData?.firstName,
      email: profileData?.email,
      originalEmail: profileData?.email,
    });
    setIsModified(false);
  }, [profileData, form]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  useEffect(() => {
    const subscription = form.watch(() => setIsModified(true));
    return () => subscription.unsubscribe();
  }, [form]);

  const hasEmailChanged = profileData?.email !== form.watch('email');

  if (profileData?.isPasswordNull) {
    return <Security profileData={profileData} fetchUserProfile={fetchUserProfile} />;
  }

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
                id="picture"
                src={profileData?.profilePicture}
                alt="User Avatar"
                style={{ width: '100%', height: '100%' }}
              />
              <AvatarFallback className="rounded-lg">{}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start gap-1 text-xs">
              <div className="flex gap-2">
                <Button className="w-fit" variant="outline" size="sm">
                  Change photo
                </Button>
                <Button className="w-fit" variant="destructive" size="sm">
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
              <Label htmlFor="firstName" className="font-semibold">
                Name
              </Label>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Name"
                        className="w-full"
                        disabled={isLoading}
                        {...field}
                      />
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
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        id="email"
                        placeholder="Email"
                        className="w-full"
                        disabled={isLoading}
                        {...field}
                      />
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
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password to confirm email change"
                            className="w-full"
                            disabled={isLoading}
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
                <Button type="button" className="w-fit" variant="ghost" onClick={resetForm} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" className="w-fit" variant="default" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update'}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
}
