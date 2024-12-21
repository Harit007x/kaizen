import { useForm } from 'react-hook-form';
import { Dispatch, FormEvent, SetStateAction } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { optSchema } from '@/zod/user';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '../ui-extended/icons';

interface OTPFormProps {
  isLoading: boolean;
  handleVerifyOTP: (values: z.infer<typeof optSchema>) => void;
}

export default function OTPForm({ isLoading, handleVerifyOTP }: OTPFormProps) {
  const form = useForm<z.infer<typeof optSchema>>({
    resolver: zodResolver(optSchema),
    defaultValues: {
      otp: '',
    },
  });
  return (
    <div className="flex flex-col align-center items-center justify-center space-y-6 ">
      <div className="flex flex-col space-y-2 text-center">
        {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleVerifyOTP)}
          className="space-y-6 w-full flex flex-col justify-center align-center items-center"
        >
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center">
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

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </Form>
    </div>
  );
}
