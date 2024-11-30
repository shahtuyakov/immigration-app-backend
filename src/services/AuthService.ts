import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User.js';
import { AppError } from '../utils/errorHandler.js';
import { env } from '../config/env.js';
import { LoginDTO, CreateUserDTO } from '../interfaces/dtos/UserDTO.js';
import { EmailService } from './EmailService.js';
import { randomBytes, createHash } from 'crypto';

export class AuthService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  private generateTokens(userId: string): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign({ id: userId }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ id: userId }, env.REFRESH_TOKEN_SECRET, {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    });

    // Store refresh token in user document
    User.findByIdAndUpdate(userId, {
      $push: { refreshTokens: accessToken }
    }).exec();

    return { accessToken, refreshToken };
  }

  async register(userData: CreateUserDTO): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } }> {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new AppError(409, 'Email already registered');
      }

      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user
      const user = await User.create({
        ...userData,
        password: hashedPassword,
        refreshTokens: [], // Initialize empty tokens array
      });

      // Generate tokens and store access token
      const tokens = this.generateTokens(user._id.toString());

      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.refreshTokens;

      return { user: userResponse, tokens };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async login(credentials: LoginDTO): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } }> {
    try {
      const user = await User.findOne({ email: credentials.email })
        .select('+password')
        .exec();

      if (!user) {
        throw new AppError(401, 'Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
      if (!isPasswordValid) {
        throw new AppError(401, 'Invalid email or password');
      }

      // Generate new tokens and store access token
      const tokens = this.generateTokens(user._id.toString());

      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.refreshTokens;

      return { user: userResponse, tokens };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Token verification
  async verifyToken(token: string): Promise<IUser> {
    try {
      console.log("Verifying token");

      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        throw new AppError(401, "Invalid token or user not found");
      }

      return user;
    } catch (error) {
      console.error("Token verification error:", error);
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError(401, "Token has expired");
      }
      throw new AppError(401, "Invalid token");
    }
  }

  // Token refresh
  async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string }> {
    try {
      console.log("Refreshing access token");

      const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET) as {
        id: string;
      };
      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        throw new AppError(401, "Invalid refresh token or user not found");
      }

      const accessToken = jwt.sign({ id: user._id }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
      });

      return { accessToken };
    } catch (error) {
      console.error("Refresh token error:", error);
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError(401, "Refresh token has expired");
      }
      throw new AppError(401, "Invalid refresh token");
    }
  }

  // Profile update
  async updateProfile(
    userId: string,
    updateData: Partial<IUser>
  ): Promise<IUser> {
    try {
      // Remove sensitive fields from update data
      const sanitizedData = { ...updateData };
      delete sanitizedData.password;
      delete sanitizedData.email;
      delete sanitizedData.role;
      delete sanitizedData.emailVerified;
      delete sanitizedData.refreshTokens;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: sanitizedData },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw new AppError(404, "User not found");
      }

      return updatedUser;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(
    userId: string, 
    currentPassword: string, 
    newPassword: string
  ): Promise<void> {
    try {
      console.log('Starting password change process for user:', userId);

      // Find user and explicitly include password field
      const user = await User.findById(userId).select('+password');
      
      if (!user) {
        console.log('User not found during password change');
        throw new AppError(404, 'User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isCurrentPasswordValid) {
        console.log('Invalid current password provided');
        throw new AppError(401, 'Current password is incorrect');
      }

      // Check if new password is different from current
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        throw new AppError(400, 'New password must be different from current password');
      }

      // Hash new password
      const salt = await bcrypt.genSalt(12);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      // Update password and invalidate all existing sessions
      user.password = hashedNewPassword;
      user.refreshTokens = []; // Invalidate all existing sessions
      
      await user.save();

      console.log('Password successfully changed for user:', userId);
    } catch (error) {
      console.error('Password change error:', error);
      
      // Handle specific error types
      if (error instanceof AppError) {
        throw error;
      }
      
      // Handle mongoose errors
      if (error.name === 'MongooseError') {
        throw new AppError(500, 'Database error during password change');
      }
      
      throw new AppError(500, 'Failed to change password');
    }
  }

  async logout(userId: string, currentToken: string): Promise<void> {
    try {
      // Remove the current refresh token from the user's refresh tokens array
      await User.findByIdAndUpdate(userId, {
        $pull: { refreshTokens: currentToken },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logoutAll(userId: string): Promise<void> {
    try {
      // Remove all refresh tokens for the user
      await User.findByIdAndUpdate(userId, {
        $set: { refreshTokens: [] },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async initiateEmailChange(userId: string, newEmail: string, currentPassword: string): Promise<void> {
    try {
      // Find user with password
      const user = await User.findById(userId).select('+password');
      if (!user) {
        throw new AppError(404, 'User not found');
      }
  
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new AppError(401, 'Current password is incorrect');
      }
  
      // Check if new email is already in use
      const emailExists = await User.findOne({ email: newEmail });
      if (emailExists) {
        throw new AppError(409, 'Email is already in use');
      }
  
      // Update email directly (in a real app, you'd want email verification)
      user.email = newEmail;
      await user.save();
  
    } catch (error) {
      console.error('Email change error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Failed to change email');
    }
  }

  async verifyEmailChange(userId: string, token: string): Promise<void> {
    try {
      const user = await User.findOne({
        _id: userId,
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() },
      });

      if (!user) {
        throw new AppError(400, "Invalid or expired verification token");
      }

      // Get the pending email from the temporary storage
      const newEmail = user.get("pendingEmail");
      if (!newEmail) {
        throw new AppError(400, "No pending email change found");
      }

      // Update the email
      user.email = newEmail;
      user.emailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      // Remove the temporary storage
      user.set("pendingEmail", undefined, { strict: false });

      await user.save();

      console.log("Email successfully changed for user:", userId);
    } catch (error) {
      console.error("Email verification error:", error);
      throw this.handleError(error);
    }
  }
  
  async requestPasswordReset(email: string): Promise<void> {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return;
      }
  
      // Generate reset token
      const resetToken = randomBytes(32).toString('hex');
      user.passwordResetToken = createHash('sha256')
        .update(resetToken)
        .digest('hex');
      
      user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();
  
      await this.emailService.sendPasswordReset(email, resetToken);
    } catch (error) {
      throw new AppError(500, 'Failed to initiate password reset');
    }
  }
  
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const hashedToken = createHash('sha256')
        .update(token)
        .digest('hex');
  
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
      });
  
      if (!user) {
        throw new AppError(400, 'Invalid or expired reset token');
      }
  
      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.refreshTokens = [];
  
      await user.save();
    } catch (error) {
      throw new AppError(500, 'Failed to reset password');
    }
  }

  private handleError(error: any): never {
    console.error('Service error:', error);
    
    if (error instanceof AppError) {
      throw error;
    }
    
    if (error.name === 'MongooseError') {
      throw new AppError(500, 'Database operation failed');
    }
    
    throw new AppError(500, 'An unexpected error occurred');
  }
}