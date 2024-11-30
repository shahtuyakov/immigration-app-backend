// Base service class to handle common CRUD operations
import mongoose, { Document, Model } from 'mongoose';
import { AppError } from '../utils/errorHandler.js';

export class BaseService<T extends Document> {
  constructor(protected model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    try {
      const entity = new this.model(data);
      return await entity.save();
    } catch (error) {
      if (error.code === 11000) { // Duplicate key error
        throw new AppError(409, 'Resource already exists');
      }
      throw error;
    }
  }

  async findById(id: string): Promise<T | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, 'Invalid ID format');
    }
    return await this.model.findById(id);
  }

  async findAll(filter = {}, options = {}): Promise<T[]> {
    return await this.model.find(filter, null, options);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, 'Invalid ID format');
    }
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, 'Invalid ID format');
    }
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }
}