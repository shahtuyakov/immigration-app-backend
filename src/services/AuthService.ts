import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User.js';
import { AppError } from '../utils/errorHandler.js';
import { env } from '../config/env.js';
import { LoginDTO, CreateUserDTO } from '../interfaces/dtos/UserDTO.js';

export class AuthService {
  private generateTokens(userId: string): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign({ id: userId }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ id: userId }, env.REFRESH_TOKEN_SECRET, {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  async register(userData: CreateUserDTO): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } }> {
    try {
      // Check for existing user
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new AppError(409, 'Email already registered');
      }

      // Hash password - using a consistent salt rounds value of 12
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      console.log('Creating user with hashed password');
      
      // Create user with hashed password
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });

      // Generate authentication tokens
      const tokens = this.generateTokens(user._id.toString());

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      return { user: userResponse, tokens };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials: LoginDTO): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } }> {
    try {
      console.log('Attempting login for:', credentials.email);
      
      // Find user and explicitly include password field
      const user = await User.findOne({ email: credentials.email })
        .select('+password')
        .exec();

      if (!user) {
        console.log('No user found with email:', credentials.email);
        throw new AppError(401, 'Invalid email or password');
      }

      // Compare passwords using bcrypt directly
      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.password
      );

      console.log('Password validation result:', isPasswordValid);

      if (!isPasswordValid) {
        throw new AppError(401, 'Invalid email or password');
      }

      // Generate new tokens after successful login
      const tokens = this.generateTokens(user._id.toString());

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      return { user: userResponse, tokens };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Token verification
  async verifyToken(token: string): Promise<IUser> {
    try {
      console.log('Verifying token');
      
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        throw new AppError(401, 'Invalid token or user not found');
      }

      return user;
    } catch (error) {
      console.error('Token verification error:', error);
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError(401, 'Token has expired');
      }
      throw new AppError(401, 'Invalid token');
    }
  }

  // Token refresh
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      console.log('Refreshing access token');
      
      const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        throw new AppError(401, 'Invalid refresh token or user not found');
      }

      const accessToken = jwt.sign({ id: user._id }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
      });

      return { accessToken };
    } catch (error) {
      console.error('Refresh token error:', error);
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError(401, 'Refresh token has expired');
      }
      throw new AppError(401, 'Invalid refresh token');
    }
  }

  // Profile update
  async updateProfile(userId: string, updateData: Partial<IUser>): Promise<IUser> {
    try {
      console.log('Attempting to update profile for user:', userId);
      
      // First, verify the user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError(404, 'User not found');
      }

      // Remove sensitive fields that shouldn't be updated directly
      const sanitizedData = { ...updateData };
      delete sanitizedData.password;
      delete sanitizedData.email;  // Typically email changes should be handled separately
      delete sanitizedData.role;   // Role changes should be handled by admin operations
      
      // Update the user document
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: sanitizedData },
        { 
          new: true,          // Return the updated document
          runValidators: true // Run model validators
        }
      );

      if (!updatedUser) {
        throw new AppError(404, 'Failed to update user profile');
      }

      console.log('Profile updated successfully for user:', userId);
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Failed to update profile');
    }
  }
}