import { z } from 'zod';

export const roleNameSchema = z.enum(['admin', 'user']);

export type RoleName = z.infer<typeof roleNameSchema>;

export const roleSchema = z.object({
  id: z.number().int().positive(),
  name: roleNameSchema,
});

export type Role = z.infer<typeof roleSchema>;

export const statusSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});

export type Status = z.infer<typeof statusSchema>;
