'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import bcrypt from 'bcryptjs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { addPasswordSchema, resetPasswordSchema } from '@/zod/user';

import { UserProfile } from '../sidebar/nav-secondary';
import { Button } from '../ui/button';
import { Form, FormField, FormItem, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Icons } from '../ui-extended/icons';

interface ISecurityProps {
  profileData: UserProfile | undefined;
  fetchUserProfile: () => void;
}

interface AddPasswordFormValues {
  addPassword: string;
}

interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPassword(props: ISecurityProps) {
  const isPasswordNull = props.profileData?.isPasswordNull ?? false;
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema> | z.infer<typeof addPasswordSchema>>({
    resolver: zodResolver(isPasswordNull ? addPasswordSchema : resetPasswordSchema),
    defaultValues: isPasswordNull ? { addPassword: '' } : { newPassword: '', confirmPassword: '' },
  });

  const handleAddPassword = async (values: AddPasswordFormValues | ResetPasswordFormValues) => {
    try {
      setIsLoading(true);
      console.log('value = ', values);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = isPasswordNull
        ? await bcrypt.hash((values as AddPasswordFormValues).addPassword, salt)
        : await bcrypt.hash((values as ResetPasswordFormValues).newPassword, salt);

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddPassword)} className="space-y-4 max-w-sm p-4">
          {isPasswordNull ? (
            <>
              <Label htmlFor="addPassword" className="font-semibold">
                Add password
              </Label>
              <FormField
                control={form.control}
                name="addPassword"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="addPassword"
                        type="password"
                        placeholder="Add password"
                        className="w-full"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
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
                        id="newPassword"
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
                        id="confirmPassword"
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
            </>
          )}
          <div className="flex items-center align-center gap-2">
            <Button className="w-fit" variant={'ghost'}>
              Cancel
            </Button>
            <Button className="w-fit" type="submit" variant={'default'} disabled={isLoading}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}

              {isPasswordNull ? 'Add' : 'Update'}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}
