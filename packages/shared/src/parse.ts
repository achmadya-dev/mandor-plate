import { z, ZodSchema } from 'zod';

export function parseWithSchema<TSchema extends ZodSchema>(
  schema: TSchema,
  input: unknown,
): z.infer<TSchema> {
  return schema.parse(input);
}

export function safeParseWithSchema<TSchema extends ZodSchema>(
  schema: TSchema,
  input: unknown,
) {
  return schema.safeParse(input);
}
