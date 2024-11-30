import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define available roles and their hierarchy
export const UserRoles = {
    USER: 'user',
    LAWYER: 'lawyer',
    ADMIN: 'admin'
  } as const;
  
  // Define permissions for each role
  export const RolePermissions = {
    [UserRoles.USER]: [
      'read:own_profile',
      'update:own_profile',
      'read:immigration_news',
      'create:immigration_case',
      'read:own_cases',
      'update:own_cases'
    ],
    [UserRoles.LAWYER]: [
      'read:own_profile',
      'update:own_profile',
      'read:immigration_news',
      'read:assigned_cases',
      'update:assigned_cases',
      'create:case_notes',
      'read:own_schedule',
      'update:own_schedule'
    ],
    [UserRoles.ADMIN]: [
      'read:all_profiles',
      'update:all_profiles',
      'delete:profiles',
      'manage:roles',
      'manage:system_settings',
      'read:all_cases',
      'update:all_cases',
      'delete:cases'
    ]
  } as const;

// Enhanced user interface with role-related types
export interface IUser extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: keyof typeof UserRoles;
    isActive: boolean;
    emailVerified: boolean;
    lastLogin?: Date;
    refreshTokens: string[];
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    hasPermission(permission: string): boolean;
  }

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Password won't be included in queries by default
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['USER', 'LAWYER', 'ADMIN'] as const,
    default: 'USER'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  refreshTokens: [{
    type: String
  }],
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date
}, {
  timestamps: true
});

// Method to check if user has a specific permission
userSchema.methods.hasPermission = function(permission: string): boolean {
    const userPermissions = RolePermissions[this.role as keyof typeof RolePermissions];
    return userPermissions.includes(permission as never);
  };
  
  export const User = mongoose.model<IUser>('User', userSchema);