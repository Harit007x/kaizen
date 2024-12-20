'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import bcrypt from 'bcryptjs';
import { UserProfile } from '../sidebar/nav-secondary';
import { Form, FormField, FormItem, FormControl, FormMessage } from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { resetPasswordSchema } from '@/zod/user';
import { Icons } from '../icons';

interface ISecurityProps {
  profileData: UserProfile | undefined;
  fetchUserProfile: () => void;
}

export default function ResetPassword(props: ISecurityProps) {
  const { data, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPass] = useState('');

  console.log('data =', data);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleAddPassword = async (values: z.infer<typeof resetPasswordSchema>) => {
    try {
      setIsLoading(true);

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(values.newPassword, salt);

      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hashedPassword }),
      });
      const data = await res.json();

      toast.success(data.message);
      props.fetchUserProfile();
    } catch (error) {
      console.log('error =', error);
      toast.error('Failed to add password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollArea className="h-[calc(70vh-4rem)] w-full">
      {props.profileData?.isPasswordNull ? (
        <div className="flex flex-col gap-3 px-4 pt-4">
          <Label className="font-semibold">Add password</Label>
          <div className="grid w-full max-w-sm gap-4 pb-6">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Input
                id="addPassword"
                onChange={(e) => setPass(e.target.value)}
                type="password"
                placeholder="Add password"
              />
            </div>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddPassword)} className="space-y-4 max-w-sm p-4">
            <Label htmlFor="newPassword" className="font-semibold">
              Change password
            </Label>
            <FormField
              control={form.control}
              name="newPassword"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="New password"
                      className="w-full"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      className="w-full"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center align-center gap-2">
              <Button className="w-fit" variant={'ghost'}>
                Cancel
              </Button>
              <Button className="w-fit" type="submit" variant={'default'} disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}

                {props.profileData?.isPasswordNull ? 'Add' : 'Update'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </ScrollArea>
  );
}
