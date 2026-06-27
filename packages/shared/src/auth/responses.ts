import { z } from 'zod';
import { userSchema } from '../user/profile';

export const tokenPairSchema = z.object({
  token: z.string().min(1),
  refreshToken: z.string().min(1),
  tokenExpires: z.number().int().positive(),
});

export type TokenPair = z.infer<typeof tokenPairSchema>;

export const loginResponseSchema = tokenPairSchema.extend({
  user: z.lazy(() => userSchema),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const refreshResponseSchema = tokenPairSchema;

export type RefreshResponse = z.infer<typeof refreshResponseSchema>;
