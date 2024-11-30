import { z } from 'zod';

// Define our password validation rules in one place for consistency
const passwordRules = {
  minLength: 8,
  maxLength: 100,
  requireUppercase: /[A-Z]/,
  requireLowercase: /[a-z]/,
  requireNumber: /[0-9]/,
  requireSpecial: /[^A-Za-z0-9]/,
};

// Create a reusable password validation schema
const passwordValidation = z.string()
  .min(passwordRules.minLength, `Password must be at least ${passwordRules.minLength} characters`)
  .max(passwordRules.maxLength, `Password cannot exceed ${passwordRules.maxLength} characters`)
  .regex(passwordRules.requireUppercase, 'Password must contain at least one uppercase letter')
  .regex(passwordRules.requireLowercase, 'Password must contain at least one lowercase letter')
  .regex(passwordRules.requireNumber, 'Password must contain at least one number')
  .regex(passwordRules.requireSpecial, 'Password must contain at least one special character');

// Email validation schema that we can reuse
const emailValidation = z.string()
  .email('Invalid email format')
  .min(5, 'Email must be at least 5 characters')
  .max(254, 'Email cannot exceed 254 characters');

// Now let's define and export all our schemas
export const registerSchema = z.object({
  body: z.object({
    email: emailValidation,
    password: passwordValidation,
    firstName: z.string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name cannot exceed 50 characters'),
    lastName: z.string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name cannot exceed 50 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: emailValidation,
    password: z.string().min(1, 'Password is required'),
  }),
});

export const passwordChangeSchema = z.object({
  body: z.object({
    currentPassword: z.string()
      .min(1, 'Current password is required'),
    newPassword: passwordValidation,
    confirmPassword: z.string()
      .min(1, 'Password confirmation is required'),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export const emailChangeSchema = z.object({
  body: z.object({
    newEmail: emailValidation,
    currentPassword: z.string()
      .min(1, 'Current password is required'),
  }),
});

export const passwordForgotSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format')
  })
});

export const passwordResetSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: passwordValidation,
    confirmPassword: z.string().min(1, 'Password confirmation is required')
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  })
});