import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User.js';
import { AppError } from '../utils/errorHandler.js';
import { env } from '../config/env.js';
import { LoginDTO, CreateUserDTO } from '../interfaces/dtos/UserDTO.js';

export class AuthService {
  // Generate both access and refresh tokens for enhanced security
  private generateTokens(userId: string) {
    const accessToken = jwt.sign({ id: userId }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ id: userId }, env.REFRESH_TOKEN_SECRET, {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  // Register new user with password hashing
  async register(userData: CreateUserDTO): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } }> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    // Create new user with hashed password
    const user = await User.create({
      ...userData,
      password: await bcrypt.hash(userData.password, 12),
    });

    // Generate tokens for immediate login
    const tokens = this.generateTokens(user._id.toString());

    return { user, tokens };
  }

  // Login user and generate tokens
  async login(credentials: LoginDTO): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } }> {
    // Find user and include password for comparison
    const user = await User.findOne({ email: credentials.email }).select('+password');
    
    if (!user || !(await user.comparePassword(credentials.password))) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError(403, 'Account is deactivated');
    }

    const tokens = this.generateTokens(user._id.toString());

    // Remove password from response
    user.password = undefined;

    return { user, tokens };
  }

  // Verify token and return user
  async verifyToken(token: string): Promise<IUser> {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        throw new AppError(401, 'Invalid token or user not found');
      }

      return user;
    } catch (error) {
      throw new AppError(401, 'Invalid or expired token');
    }
  }

  // Refresh access token using refresh token
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
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
      throw new AppError(401, 'Invalid or expired refresh token');
    }
  }
}