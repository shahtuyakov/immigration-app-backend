import { User, IUser } from '../models/User.js';
import { BaseService } from './BaseService.js';
import { AppError } from '../utils/errorHandler.js';
import bcrypt from 'bcryptjs';

export class UserService extends BaseService<IUser> {
  constructor() {
    super(User);
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    // Additional user-specific validation
    if (!userData.email || !userData.password) {
      throw new AppError(400, 'Email and password are required');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError(409, 'User with this email already exists');
    }

    return await this.create(userData);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select('+password');
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      throw new AppError(401, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();
  }

  async updateProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    // Prevent password update through this method
    delete updateData.password;
    
    return await this.update(userId, updateData);
  }
}