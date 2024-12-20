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
    originalEmail: z.string().optional(),
  })
  .refine(
    (data) => {
      // Only require password if email is different from the original
      if (data.email && data.email !== data.originalEmail && (!data.password || data.password.trim() === '')) {
        return false;
      }
      return true;
    },
    {
      message: 'Password is required when changing email.',
      path: ['password'],
    }
  );
