import { z } from 'zod';

export const namePartSchema = z.string().trim().min(1, 'Required');
