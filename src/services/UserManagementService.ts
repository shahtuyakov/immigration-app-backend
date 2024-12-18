import { User } from '../models/User.js';
import { AppError } from '../utils/errorHandler.js';

export class UserManagementService {
  async updateUserRole(userId: string, newRole: 'user' | 'lawyer' | 'admin'): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    );
    
    if (!user) throw new AppError(404, 'User not found');
    return user;
  }

  async getUserById(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) throw new AppError(404, 'User not found');
    return user;
  }

  async getAllUsers(page = 1, limit = 10): Promise<{ users: IUser[]; total: number }> {
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await User.countDocuments();
    return { users, total };
  }
}