import { CorsOptions } from 'cors';
import { env } from './env.js';

export const corsOptions: CorsOptions = {
  origin: env.NODE_ENV === 'production' 
    ? [env.CLIENT_URL] // We'll need to add CLIENT_URL to env variables
    : true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600
};

export const securityConfig = {
  jwtExpiresIn: '24h',
  passwordMinLength: 8,
  passwordMaxLength: 100,
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  tokenSecret: env.JWT_SECRET,
};

export const passwordValidationRegex = {
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumbers: /\d/,
  hasSpecialChar: /[!@#$%^&*]/,
  validLength: new RegExp(`^.{${securityConfig.passwordMinLength},${securityConfig.passwordMaxLength}}$`)
};