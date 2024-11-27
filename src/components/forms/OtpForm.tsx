import { useForm } from 'react-hook-form';
import { Dispatch, FormEvent, SetStateAction } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { optSchema } from '@/zod/user';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '../icons';

interface OTPFormProps {
  isLoading: boolean;
  handleVerifyOTP: (values: z.infer<typeof optSchema>) => void;
  setOtp?: Dispatch<SetStateAction<string>>;
}

export default function OTPForm({ isLoading, setOtp, handleVerifyOTP }: OTPFormProps) {
  const form = useForm<z.infer<typeof optSchema>>({
    resolver: zodResolver(optSchema),
    defaultValues: {
      otp: '',
    },
  });
  return (
    <div className="flex align-center items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleVerifyOTP)} className="space-y-6 w-full">
          <FormField
            control={form.control}
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

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Verify Email
          </Button>
        </form>
      </Form>
    </div>
  );
}
