import { z } from 'zod';
import { passwordValidationRegex } from '../config/security.js';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password is too long')
      .regex(passwordValidationRegex.hasUpperCase, 'Password must contain at least one uppercase letter')
      .regex(passwordValidationRegex.hasLowerCase, 'Password must contain at least one lowercase letter')
      .regex(passwordValidationRegex.hasNumbers, 'Password must contain at least one number')
      .regex(passwordValidationRegex.hasSpecialChar, 'Password must contain at least one special character'),
    firstName: z.string().min(2, 'First name is too short').max(50, 'First name is too long'),
    lastName: z.string().min(2, 'Last name is too short').max(50, 'Last name is too long'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});