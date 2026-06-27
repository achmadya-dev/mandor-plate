import { z } from 'zod';
import { emailSchema, namePartSchema, passwordSchema } from '../common';

export const emailLoginRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type EmailLoginRequest = z.infer<typeof emailLoginRequestSchema>;

export const registerRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: namePartSchema,
  lastName: namePartSchema,
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const forgotPasswordRequestSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;

export const resetPasswordRequestSchema = z.object({
  password: passwordSchema,
  hash: z.string().trim().min(1, 'Reset hash is required'),
});

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;

export const confirmEmailRequestSchema = z.object({
  hash: z.string().trim().min(1, 'Confirmation hash is required'),
});

export type ConfirmEmailRequest = z.infer<typeof confirmEmailRequestSchema>;

export const googleLoginRequestSchema = z.object({
  idToken: z.string().trim().min(1, 'Google ID token is required'),
});

export type GoogleLoginRequest = z.infer<typeof googleLoginRequestSchema>;

export const authUpdateRequestSchema = z
  .object({
    firstName: namePartSchema.optional(),
    lastName: namePartSchema.optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
    oldPassword: z.string().min(1).optional(),
    photo: z
      .object({
        id: z.string().uuid(),
      })
      .nullable()
      .optional(),
  })
  .refine((data) => !data.password || data.oldPassword, {
    message: 'Current password is required to set a new password',
    path: ['oldPassword'],
  });

export type AuthUpdateRequest = z.infer<typeof authUpdateRequestSchema>;
