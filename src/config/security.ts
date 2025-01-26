import { CorsOptions } from 'cors';
import { env } from '../config/env.js';

export const corsOptions: CorsOptions = {
  origin: env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 600 // 10 minutes
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