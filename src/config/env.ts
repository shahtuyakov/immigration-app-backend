import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env file before any validation
const result = dotenv.config();

if (result.error) {
  throw new Error('Failed to load .env file');
}

// Define environment variable schema
const envSchema = z.object({
  // Environment & Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),

  // Database
  MONGODB_URI: z.string().url(),

  // Authentication
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('1d'),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),

  // Security
  RATE_LIMIT_WINDOW: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),

  // Azure AD
  AZURE_AD_TENANT_ID: z.string(),
  AZURE_AD_CLIENT_ID: z.string(),
  AZURE_AD_CLIENT_SECRET: z.string(),

  // New Relic
  NEW_RELIC_LICENSE_KEY: z.string(),

  // Email Configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // USCIS API
  USCIS_CLIENT_ID: z.string(),
  USCIS_CLIENT_SECRET: z.string(),
  USCIS_API_URL: z.string().url(),
  USCIS_TOKEN_URL: z.string().url(),

  // OAuth Configuration
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  APPLE_CLIENT_ID: z.string(),
  APPLE_TEAM_ID: z.string(),
  APPLE_KEY_ID: z.string(),
  APPLE_PRIVATE_KEY: z.string(),

  // News API Configuration
  RAPIDAPI_KEY: z.string(),
  RAPIDAPI_HOST: z.string(),
});

// Validate environment variables
let validatedEnv: z.infer<typeof envSchema>;

try {
  validatedEnv = envSchema.parse(process.env);
} catch (error) {
  console.error('❌ Invalid environment variables:', error);
  process.exit(1);
}

// Export the validated env object
export const env = validatedEnv;

// Export individual constants
export const {
  NODE_ENV,
  PORT,
  MONGODB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  RATE_LIMIT_WINDOW,
  RATE_LIMIT_MAX,
  CLIENT_URL,
  AZURE_AD_TENANT_ID,
  AZURE_AD_CLIENT_ID,
  AZURE_AD_CLIENT_SECRET,
  NEW_RELIC_LICENSE_KEY,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  USCIS_CLIENT_ID,
  USCIS_CLIENT_SECRET,
  USCIS_API_URL,
  USCIS_TOKEN_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  APPLE_CLIENT_ID,
  APPLE_TEAM_ID,
  APPLE_KEY_ID,
  APPLE_PRIVATE_KEY,
  RAPIDAPI_KEY,
  RAPIDAPI_HOST,
} = validatedEnv;
