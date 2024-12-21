'use client';

import { Icons } from '@/components/ui-extended/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Form, FormField, FormItem, FormControl, FormMessage, FormDescription, FormLabel } from '../ui/form';
import { useForm } from 'react-hook-form';
import { emailSchema, forgotPasswordSchema } from '@/zod/user';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export default function ForgotPassForm() {
  const router = useRouter();
  const [showResetPage, setShowResetPage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const forgotPassForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const resetPassForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
      otp: '',
    },
  });

  async function sendOTP(values: z.infer<typeof emailSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          isSigningUp: false,
        }),
      });

      setEmail(values.email);

      const data = await res.json();

      if (res.ok) {
        setShowResetPage(true);
        forgotPassForm.reset();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleChangePassword(values: z.infer<typeof forgotPasswordSchema>) {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
          otp: values.otp,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setShowResetPage(false);
        toast.success(data.message);
        router.push('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log('error :', error);
    } finally {
      setIsLoading(false);
    }
  }

  const isForgotPassFormEmpty = forgotPassForm.watch('email') === '';

  const isResetPassFormEmpty =
    resetPassForm.watch('newPassword') === '' && resetPassForm.watch('confirmPassword') === '';

  return (
    <main className="relative flex h-screen w-screen flex-col items-center justify-center px-6">
      <Link
        href="/login"
        className={cn(
          'absolute right-4 top-4 md:right-8 md:top-8 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
        )}
      >
        Login
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
          <p className="text-sm text-muted-foreground">Enter your email to reset your password</p>
        </div>
        {!showResetPage ? (
          <Form {...forgotPassForm} key={'forgotPassword'}>
            <form onSubmit={forgotPassForm.handleSubmit(sendOTP)} className="space-y-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <FormField
                    control={forgotPassForm.control}
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
                </div>
              </div>

              <div className={cn('w-full select-none', { 'cursor-not-allowed': isForgotPassFormEmpty })}>
                <Button
                  className={cn('w-full', { 'pointer-events-none opacity-50': isForgotPassFormEmpty })}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Send Otp
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <Form {...resetPassForm} key={'resetPassword'}>
            <form onSubmit={resetPassForm.handleSubmit(handleChangePassword)} className="space-y-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <FormField
                    control={resetPassForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>One-Time Password (OTP)</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription className="w-fit">
                          Please enter the one-time password sent to your email.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resetPassForm.control}
                    name="newPassword"
                    disabled={isLoading}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="password" placeholder="New Password" className="w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resetPassForm.control}
                    name="confirmPassword"
                    disabled={isLoading}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="password" placeholder="Confirm Password" className="w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className={cn('w-full select-none', { 'cursor-not-allowed': isResetPassFormEmpty })}>
                <Button
                  className={cn('w-full', { 'pointer-events-none opacity-50': isResetPassFormEmpty })}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Change Password
                </Button>
              </div>
            </form>
          </Form>
        )}
        <p className="sm:px-8 text-center text-sm text-gray-500">
          <Link href="/login" className="hover:text-brand hover:underline underline-offset-4">
            Back to Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
