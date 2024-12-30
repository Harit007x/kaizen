'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui-extended/icons';
import { cn } from '@/lib/utils';
import { signInSchema } from '@/zod/user';

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
        handleAuthError(res.status);
      }
    } catch (error) {
      console.error('error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  function handleAuthError(status: number) {
    const errorMessages: Record<number, string> = {
      401: 'Invalid Credentials, try again!',
      400: 'Missing Credentials!',
      404: 'Account not found!',
      403: 'Forbidden!',
    };
    toast.error(errorMessages[status] || 'Oops, something went wrong!');
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLogin(true);
    try {
      const res = await signIn('google', { callbackUrl: '/inbox' });
      if (!res?.error) {
        toast.success('Signed In');
      } else {
        toast.error('Sign in failed');
      }
    } catch (error) {
      console.error('error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsGoogleLogin(false);
    }
  };

  const isFormEmpty = form.watch('email') === '' && form.watch('password') === '';

  return (
    <main className="relative flex h-screen w-screen flex-col items-center justify-center px-6">
      <Link
        href="/"
        className={cn(
          'absolute flex justify-center items-center gap-2 left-4 top-4 hover:bg-accent h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 ring-offset-background'
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
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
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading || isFormEmpty}
              className={cn('w-full', { 'opacity-50 cursor-not-allowed': isFormEmpty })}
            >
              {isLoading && <Icons.spinner className="animate-spin" />}
              Sign In
            </Button>
            <div className="flex items-center justify-center w-full my-2">
              <div className="h-px flex-1 bg-gray-700"></div>
              <span className="px-3 text-sm text-gray-500">OR</span>
              <div className="h-px flex-1 bg-gray-700"></div>
            </div>

            <Button
              className="w-full"
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isGoogleLogin && <Icons.spinner className="animate-spin" />}
              <Icons.google className="h-12 w-12" /> Login with Google
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm">
          <Link href="/signup" className="hover:underline">
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
