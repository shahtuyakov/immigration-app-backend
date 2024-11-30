import { cleanEnv, str, port, num, url } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  PORT: port({ default: 3000 }),
  
  // Database
  MONGODB_URI: str(),
  
  // Authentication
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: '24h' }),
  REFRESH_TOKEN_SECRET: str(),
  REFRESH_TOKEN_EXPIRES_IN: str({ default: '7d' }),
  
  // Security
  CLIENT_URL: url({ default: 'http://localhost:3000' }),
  RATE_LIMIT_WINDOW: num({ default: 15 * 60 * 1000 }),
  RATE_LIMIT_MAX: num({ default: 100 }),
  
  // Email (for password reset, etc.)
  SMTP_HOST: str({ default: undefined, optional: true }),
  SMTP_PORT: num({ default: undefined, optional: true }),
  SMTP_USER: str({ default: undefined, optional: true }),
  SMTP_PASS: str({ default: undefined, optional: true }),
});