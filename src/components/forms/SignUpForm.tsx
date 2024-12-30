'use client';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui-extended/icons';
import { cn } from '@/lib/utils';
import { optSchema, signUpSchema, verifySchema } from '@/zod/user';

import OTPForm from './OtpForm';

export default function SignUpForm() {
  const router = useRouter();
  const [showOTPPage, setShowOTPPage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  } | null>(null);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const sendOTP = useCallback(async (values: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          isSigningUp: true,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setUserData({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        });
        setShowOTPPage(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleVerifyOTP = useCallback(
    async (values: z.infer<typeof optSchema>) => {
      if (!userData) {
        toast.error('Please fill in all fields.');
        return;
      }

      setIsLoading(true);
      try {
        const validatedData = await verifySchema.parseAsync({
          ...userData,
          otp: values.otp,
        });

        const res = await fetch('/api/auth/sign-up', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(validatedData),
        });

        const data = await res.json();

        if (res.ok) {
          toast.success(data.message);
          setShowOTPPage(false);
          router.push('/login');
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error('Verification failed');
      } finally {
        setIsLoading(false);
      }
    },
    [userData, router]
  );

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const res = await signIn('google', { redirect: false });
      if (!res?.error) {
        toast.success('Signed In');
      } else {
        toast.error('Something went wrong!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to sign in with Google');
    }
  }, []);

  if (showOTPPage) {
    return (
      <main className="flex h-screen w-screen items-center justify-center sm:p-0">
        <OTPForm handleVerifyOTP={handleVerifyOTP} isLoading={isLoading} />
      </main>
    );
  }

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
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(sendOTP)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="First Name" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit" disabled={isLoading || !form.formState.isDirty}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up with Email
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <Icons.google className="mr-2 h-4 w-4" />
                Sign up with Google
              </Button>
            </form>
          </Form>

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link href="/terms" className="hover:text-brand underline underline-offset-4">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="hover:text-brand underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
