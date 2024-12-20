// src/services/NewsService.ts
import { News } from '../models/News.js';
import { AppError } from '../utils/errorHandler.js';

export class NewsService {
  async createNews(newsData: any): Promise<any> {
    try {
      const news = await News.create(newsData);
      return news;
    } catch (error) {
      throw new AppError(400, 'Failed to create news');
    }
  }

  async getNews(filters: any = {}, page = 1, limit = 10): Promise<{ news: any[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const news = await News.find(filters)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit);
      const total = await News.countDocuments(filters);
      return { news, total };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch news');
    }
  }

  async getNewsById(id: string): Promise<any> {
    try {
      const news = await News.findById(id);
      if (!news) {
        throw new AppError(404, 'News not found');
      }
      return news;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to fetch news');
    }
  }

  async updateNews(id: string, updateData: any): Promise<any> {
    try {
      const news = await News.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      if (!news) {
        throw new AppError(404, 'News not found');
      }
      return news;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to update news');
    }
  }

  async deleteNews(id: string): Promise<void> {
    try {
      const news = await News.findByIdAndDelete(id);
      if (!news) {
        throw new AppError(404, 'News not found');
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to delete news');
    }
  }

  async searchNews(query: string): Promise<any[]> {
    try {
      return await News.find({
        $or: [
          { headline: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      });
    } catch (error) {
      throw new AppError(500, 'Failed to search news');
    }
  }
}