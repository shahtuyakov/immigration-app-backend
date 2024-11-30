import { z } from 'zod';
import { UserRoles } from '../models/User.js';

// Base schema for common profile fields
const baseProfileSchema = {
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'First name can only contain letters, spaces, and hyphens'),
  
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'Last name can only contain letters, spaces, and hyphens'),
  
  phoneNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional(),
  
  language: z.enum(['en', 'es', 'fr', 'ru'])
    .optional(),
  
  timeZone: z.string()
    .regex(/^[A-Za-z_]+\/[A-Za-z_]+$/, 'Invalid timezone format')
    .optional(),
};

// Schema for regular profile updates
export const profileUpdateSchema = z.object({
  body: z.object({
    ...baseProfileSchema,
    notificationPreferences: z.object({
      email: z.boolean(),
      sms: z.boolean(),
      push: z.boolean(),
    }).optional(),
  }),
});

// Schema for email change requests
export const emailChangeSchema = z.object({
  body: z.object({
    newEmail: z.string()
      .email('Invalid email format')
      .min(5, 'Email must be at least 5 characters')
      .max(254, 'Email cannot exceed 254 characters'),
    currentPassword: z.string()
      .min(1, 'Current password is required'),
  }),
});

// Schema for password change
export const passwordChangeSchema = z.object({
  body: z.object({
    currentPassword: z.string()
      .min(1, 'Current password is required'),
    newPassword: z.string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password cannot exceed 100 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string()
      .min(1, 'Password confirmation is required'),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),
});