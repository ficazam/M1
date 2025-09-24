import { z } from "zod";

export const env = z
  .object({
    API_URL: z.url(),
  })
  .parse(process.env);
