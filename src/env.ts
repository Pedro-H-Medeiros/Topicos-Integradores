import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  CORS_ORIGIN: z.string().url(),
  PORT: z.coerce.number().default(3333),
  JWT_PUBLIC_KEY: z.string(),
  JWT_PRIVATE_KEY: z.string(),
  MAIL_HOST: z.string(),
  MAIL_USER: z.string(),
  MAIL_PASSWORD: z.string(),
  MAIL_FROM: z.string(),
})

export type Env = z.infer<typeof envSchema>
