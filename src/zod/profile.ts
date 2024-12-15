import { z } from 'zod';

export const profileSchema = z
  .object({
    firstName: z.string().optional(),
    email: z.string().optional(),
    password: z
      .string()
      .optional()
      .refine((value) => !value || value.length >= 8, {
        message: 'Password must be at least 8 characters.',
      })
      .refine((value) => !value || /[a-z]/.test(value), {
        message: 'Include at least one lowercase letter.',
      })
      .refine((value) => !value || /[A-Z]/.test(value), {
        message: 'Include at least one uppercase letter.',
      })
      .refine((value) => !value || /\d/.test(value), {
        message: 'Include at least one number.',
      })
      .refine((value) => !value || /[@$!%*?&]/.test(value), {
        message: 'Include at least one special character (@, $, !, %, *, ?, or &).',
      }),
  })
  .superRefine((data, ctx) => {
    if (data.email && (!data.password || data.password.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password is required when email is provided.',
        path: ['password'],
      });
    }
  });
