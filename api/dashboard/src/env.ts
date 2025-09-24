import { z } from 'zod';

export const env = z
  .object({
    PORT: z.coerce.number().int().positive().default(3001),
    CORS_ORIGIN: z.url().default('http://localhost:3000'),
  })
  .parse(process.env);
