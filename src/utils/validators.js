import { z } from 'zod';

export const recordSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, "Category is required"),
  date: z.string().optional(),
  description: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});