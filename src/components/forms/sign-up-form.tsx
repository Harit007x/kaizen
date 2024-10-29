'use client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Icons } from '../icons';
import { signUpSchema } from '@/zod/user';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserRegisterForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(formData: z.infer<typeof signUpSchema>) {
    setIsLoading(true);
    // const res = await createUser(formData);
    const response = await fetch('/sign-up')
    // if (!res?.error) {
    //   toast.success(res.message);
    //   router.push('/login');
    // } else {
    //   console.log('toasted');
    //   toast.error(res.error, {
    //     action: {
    //       label: 'Close',
    //       onClick: () => console.log('Closed Toast'),
    //     },
    //   });
    // }
    setIsLoading(false);
  }

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 py-2 pb-6">
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

          <Button className="md:right-8 md:top-8 w-full" type="submit" disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Sign-Up with Email
          </Button>
          <Button
            className="md:right-8 md:top-8 w-full mt-2"
            disabled={isLoading}
            type='button'
            onClick={() => signIn("google")}
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Sign in with Google
          </Button>
        </form>
      </Form>
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div> */}
    </div>
  );
}
