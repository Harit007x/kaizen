'use client';

import { Icons } from '@/components/ui-extended/icons';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { signInSchema } from '@/zod/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function handleSignIn(values: z.infer<typeof signInSchema>) {
    setIsLoading(true);
    try {
      const res = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!res?.error) {
        toast.success('Signed In');
        router.push('/inbox');
      } else {
        switch (res.status) {
          case 401:
            toast.error('Invalid Credentials, try again!');
            break;
          case 400:
            toast.error('Missing Credentials!');
            break;
          case 404:
            toast.error('Account not found!');
            break;
          case 403:
            toast.error('Forbidden!');
            break;
          default:
            toast.error('Oops, something went wrong!');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  const isFormEmpty = form.watch('email') === '' && form.watch('password') === '';

  return (
    <main className="relative flex h-screen w-screen flex-col items-center justify-center px-6">
      <Link
        href="/"
        className={cn(
          'absolute flex justify-center items-center align-center gap-2 left-4 top-4 md:left-8 md:top-8 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
        )}
      >
        <Icons.chevronLeft className="w-4 h-4" /> Home
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your email to sign in to your account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  disabled={isLoading || isGoogleLogin}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="email" placeholder="Email" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  disabled={isLoading || isGoogleLogin}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="password" placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="text-right text-sm text-gray-500 p-0 m-0">
                <Link href="/forgot-password" className="hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-center justify-center">
              <div className={cn('w-full select-none', { 'cursor-not-allowed': isFormEmpty })}>
                <Button
                  className={cn('w-full', { 'pointer-events-none opacity-50': isFormEmpty })}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </div>

              <div className="flex items-center justify-center w-full my-2">
                <div className="h-px flex-1 bg-gray-700"></div>
                <span className="px-3 text-sm text-gray-500">OR</span>
                <div className="h-px flex-1 bg-gray-700"></div>
              </div>
              <Button
                className="w-full"
                variant={'outline'}
                disabled={isLoading}
                type="button"
                onClick={async () => {
                  setIsGoogleLogin(true);
                  try {
                    const res = await signIn('google', { callbackUrl: '/inbox' });
                    // Check for !res?.error instead of res?.ok
                    if (!res?.error) {
                      toast.success('Signed In');
                    } else {
                      toast.error('Sign in failed');
                    }
                  } catch (error) {
                    toast.error('An unexpected error occurred');
                  } finally {
                    setIsGoogleLogin(false);
                  }
                }}
              >
                {isGoogleLogin && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                <Icons.google className="h-12 w-12" /> Login with Google
              </Button>
            </div>
          </form>
        </Form>

        <p className="sm:px-8 text-center text-sm text-gray-500">
          <Link href="/signup" className="hover:text-brand hover:underline underline-offset-4">
            Don't have an account? Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
