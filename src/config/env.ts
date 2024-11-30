import { cleanEnv, str, port, num } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

export const env = cleanEnv(process.env, {
  // Server
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  PORT: port({ default: 3000 }),
  
  // MongoDB
  MONGODB_URI: str(),
  
  // JWT
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: '24h' }),
  
  // Azure
  AZURE_AD_TENANT_ID: str(),
  AZURE_AD_CLIENT_ID: str(),
  AZURE_AD_CLIENT_SECRET: str(),
  
  // Monitoring
  NEW_RELIC_LICENSE_KEY: str(),
  
  // API Rate Limiting
  RATE_LIMIT_WINDOW: num({ default: 15 * 60 * 1000 }), // 15 minutes
  RATE_LIMIT_MAX: num({ default: 100 }), // requests per window
});