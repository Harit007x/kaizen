import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().min(1, 'Username is required').email('Invalid email').max(30),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters').max(10),
});

export const signInSchema = z.object({
  username: z.string().min(1, 'Username is required').email('Invalid email').max(30),
  password: z.string().min(1, 'Password is required'),
});