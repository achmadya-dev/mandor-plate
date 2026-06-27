import { z } from 'zod';
import { roleSchema, statusSchema } from './role';

export const photoSchema = z.object({
  id: z.string().uuid(),
  path: z.string().url().or(z.string().startsWith('/')),
});

export type Photo = z.infer<typeof photoSchema>;

export const userSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email().nullable(),
  provider: z.string(),
  socialId: z.string().nullable().optional(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  photo: photoSchema.nullable().optional(),
  role: roleSchema.nullable().optional(),
  status: statusSchema.optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;

export const sessionUserSchema = userSchema.pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  photo: true,
  role: true,
});

export type SessionUser = z.infer<typeof sessionUserSchema>;
