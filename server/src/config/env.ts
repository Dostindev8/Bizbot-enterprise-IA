import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const DEFAULT_DEV_JWT = 'bizbot_dev_only_jwt_secret_min_32_chars_ok';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  SERVER_URL: z.string().default('http://localhost:5000'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  JWT_SECRET: z.string().min(32).default(DEFAULT_DEV_JWT),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/bizbot_enterprise'),
  REDIS_URL: z.string().optional(),
  QDRANT_URL: z.string().default('http://localhost:6333'),
  QDRANT_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  AI_DEFAULT_MODEL: z.string().default('claude-3-5-sonnet-latest'),
  AI_FAST_MODEL: z.string().default('claude-3-5-haiku-latest'),
  AI_HIGH_MODEL: z.string().default('claude-3-opus-latest'),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  ALLOW_DEMO_MFA: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
});

const parsed = EnvSchema.parse(process.env);

if (parsed.NODE_ENV === 'production') {
  const rawSecret = process.env.JWT_SECRET;
  if (!rawSecret || rawSecret.length < 32 || rawSecret === DEFAULT_DEV_JWT) {
    throw new Error('JWT_SECRET (>=32 chars, non-default) is required in production');
  }
}

export const env = parsed;
export type Env = z.infer<typeof EnvSchema>;
