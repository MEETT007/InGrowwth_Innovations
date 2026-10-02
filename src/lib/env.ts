import { z } from 'zod';

const isServer = typeof window === 'undefined';

const serverSchema = z.object({
  APP_ENV: z.enum(['development', 'production']).default('development'),
  LOG_ENABLED: z.string().optional().transform((s) => s === 'true').default(true),
  DATABASE_URL: z.string().url().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1).optional(),
  MAIL_FROM: z.string().min(1).optional(),
  MAIL_TO_ADMIN: z.string().min(1).optional(),
  AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
  AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_BUCKET_NAME: z.string().min(1).optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_LOG_ENABLED: z.string().optional().transform((s) => s === 'true').default(true),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string().min(1).optional(),
});

const clientEnv = clientSchema.safeParse({
  NEXT_PUBLIC_LOG_ENABLED: process.env.NEXT_PUBLIC_LOG_ENABLED,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,
});

if (!clientEnv.success) {
  console.error("❌ Invalid Client environment variables:", clientEnv.error.flatten().fieldErrors);
  throw new Error("Invalid Client environment variables");
}

let serverEnvData = {};
let appEnv = 'development';

if (isServer) {
  const serverEnv = serverSchema.safeParse({
    APP_ENV: process.env.APP_ENV,
    LOG_ENABLED: process.env.LOG_ENABLED,
    DATABASE_URL: process.env.DATABASE_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    MAIL_FROM: process.env.MAIL_FROM,
    MAIL_TO_ADMIN: process.env.MAIL_TO_ADMIN,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  });

  if (!serverEnv.success) {
    console.error("❌ Invalid Server environment variables:", serverEnv.error.flatten().fieldErrors);
    throw new Error("Invalid Server environment variables");
  }
  
  serverEnvData = serverEnv.data;
  appEnv = serverEnv.data.APP_ENV;
}

type ServerEnv = z.infer<typeof serverSchema>;

export const env = {
  ...clientEnv.data,
  ...(serverEnvData as ServerEnv),
  APP_ENV: appEnv,
  isDevelopment: appEnv === 'development',
  isProduction: appEnv === 'production',
};
