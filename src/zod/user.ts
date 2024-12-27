import { z } from 'zod';

export const optSchema = z.object({
  otp: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
});

export const forgotPasswordSchema = z
  .object({
    email: z.string().email().optional(),
    newPassword: z
      .string()
      .min(1, 'Please enter your new password.')
      .min(8, 'Password must be at least 8 characters.')
      .refine((value) => /[a-z]/.test(value), {
        message: 'Include at least one lowercase letter.',
      })
      .refine((value) => /[A-Z]/.test(value), {
        message: 'Include at least one uppercase letter.',
      })
      .refine((value) => /\d/.test(value), {
        message: 'Include at least one number.',
      })
      .refine((value) => /[@$!%*?&]/.test(value), {
        message: 'Include at least one special character (@, $, !, %, *, ?, or &).',
      }),

    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
    otp: z.string().min(6, {
      message: 'Your one-time password must be 6 characters.',
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const emailSchema = z.object({
  email: z.string().min(1, 'Email is required.').email('Invalid email format').email('Invalid email address'),
});

export const signInSchema = z.object({
  email: z.string().min(1, 'Email is required.').email('Invalid email format').email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required.')
    .min(8, 'Password must be at least 8 characters.')
    .refine((value) => /[a-z]/.test(value), {
      message: 'Include at least one lowercase letter.',
    })
    .refine((value) => /[A-Z]/.test(value), {
      message: 'Include at least one uppercase letter.',
    })
    .refine((value) => /\d/.test(value), {
      message: 'Include at least one number.',
    })
    .refine((value) => /[@$!%*?&]/.test(value), {
      message: 'Include at least one special character (@, $, !, %, *, ?, or &).',
    }),
});

export const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required.').email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required.')
    .min(8, 'Password must be at least 8 characters.')
    .refine((value) => /[a-z]/.test(value), {
      message: 'Include at least one lowercase letter.',
    })
    .refine((value) => /[A-Z]/.test(value), {
      message: 'Include at least one uppercase letter.',
    })
    .refine((value) => /\d/.test(value), {
      message: 'Include at least one number.',
    })
    .refine((value) => /[@$!%*?&]/.test(value), {
      message: 'Include at least one special character (@, $, !, %, *, ?, or &).',
    }),
});

export const verifySchema = signUpSchema.extend({
  otp: z.string().min(1, 'OTP is required'),
});

export const addPasswordSchema = z.object({
  addPassword: z
    .string()
    .min(1, 'Please enter your password.')
    .min(8, 'Password must be at least 8 characters.')
    .refine((value) => /[a-z]/.test(value), {
      message: 'Include at least one lowercase letter.',
    })
    .refine((value) => /[A-Z]/.test(value), {
      message: 'Include at least one uppercase letter.',
    })
    .refine((value) => /\d/.test(value), {
      message: 'Include at least one number.',
    })
    .refine((value) => /[@$!%*?&]/.test(value), {
      message: 'Include at least one special character (@, $, !, %, *, ?, or &).',
    }),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, 'Please enter your new password.')
      .min(8, 'Password must be at least 8 characters.')
      .refine((value) => /[a-z]/.test(value), {
        message: 'Include at least one lowercase letter.',
      })
      .refine((value) => /[A-Z]/.test(value), {
        message: 'Include at least one uppercase letter.',
      })
      .refine((value) => /\d/.test(value), {
        message: 'Include at least one number.',
      })
      .refine((value) => /[@$!%*?&]/.test(value), {
        message: 'Include at least one special character (@, $, !, %, *, ?, or &).',
      }),

    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
