'use client';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { optSchema, signUpSchema, verifySchema } from '@/zod/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import prisma from '@/db';
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

  async function sendOTP(values: z.infer<typeof signUpSchema>) {
    console.log('checking the otp =');
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
      console.log('data =', data);
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
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOTP(values: z.infer<typeof optSchema>) {
    setIsLoading(true);
    const otp = values.otp;
    if (!userData) {
      return toast.error('Please fill in all fields.');
    }
    console.log('check the userdata =', userData, otp);
    const { firstName, lastName, email, password } = await verifySchema.parseAsync({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      otp,
    });
    if (!values.otp) {
      return toast.error('Please Enter 6 digit OTP');
    }

    const body = {
      firstName,
      lastName,
      email,
      password,
      otp,
    };

    if (!email || !password) {
      return toast.error('Account details are not saved.');
    }

    try {
      const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(body),
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
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex h-screen w-screen items-center justify-center sm:p-0">
      {showOTPPage ? (
        <OTPForm handleVerifyOTP={handleVerifyOTP} isLoading={isLoading} />
      ) : (
        <FormComponent form={form} isLoading={isLoading} sendOTP={sendOTP} />
      )}
    </main>
  );
}

interface FormProps {
  form: UseFormReturn<z.infer<typeof signUpSchema>, any, undefined>;
  isLoading: boolean;
  sendOTP: (values: z.infer<typeof signUpSchema>) => void;
}

function FormComponent({ form, isLoading, sendOTP }: FormProps) {
  const isFormEmpty =
    form.watch('email') === '' &&
    form.watch('firstName') === '' &&
    form.watch('lastName') === '' &&
    form.watch('password') === '';
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
            {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(sendOTP)}>
              <div className="flex flex-col gap-4 py-2 pb-6">
                <div className="flex flex-col gap-2 items-start">
                  <div className="flex items-center gap-4 w-full">
                    <FormField
                      control={form.control}
                      name="firstName"
                      disabled={isLoading}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input placeholder="First Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* <span className="text-muted-foreground">-</span> */}
                    <FormField
                      control={form.control}
                      name="lastName"
                      disabled={isLoading}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  disabled={isLoading}
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

              <div className="flex flex-col gap-2 items-center justify-center">
                <div className={cn('w-full select-none', { 'cursor-not-allowed': isFormEmpty })}>
                  <Button
                    className={cn('w-full', { 'pointer-events-none opacity-50': isFormEmpty })}
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                    Sign-Up with Email
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
                  type="button"
                  disabled={isLoading}
                  onClick={async () => {
                    const res = await signIn('google', { redirect: false });

                    if (!res?.error) {
                      toast.success('Signed In');
                    } else {
                      toast.error('oops something went wrong..!');
                    }
                  }}
                >
                  {/* {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />} */}
                  <Icons.google className="h-12 w-12" /> Sign up with Google
                </Button>
              </div>
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
