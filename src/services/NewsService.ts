import { News } from '../models/News.js';
import { AppError } from '../utils/errorHandler.js';
import mongoose from 'mongoose';

export class NewsService {
  /**
   * Get paginated news with optional filtering
   */
  async getNews(
    filters: any = {}, 
    page = 1, 
    limit = 10
  ): Promise<{ news: any[]; total: number; page: number; pages: number }> {
    try {
      const skip = (page - 1) * limit;
      
      // Create a query with filters
      const query = News.find(filters)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit);
      
      // Execute query
      const news = await query;
      
      // Get total count for pagination
      const total = await News.countDocuments(filters);
      
      // Calculate total pages
      const pages = Math.ceil(total / limit);
      
      return { 
        news, 
        total, 
        page, 
        pages 
      };
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new AppError(500, 'Failed to fetch news from database');
    }
  }

  /**
   * Get a single news item by ID
   */
  async getNewsById(id: string): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(400, 'Invalid news ID format');
      }
      
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

  /**
   * Search news by keyword
   */
  async searchNews(query: string): Promise<any[]> {
    try {
      if (!query || query.trim().length < 2) {
        throw new AppError(400, 'Search query must be at least 2 characters');
      }
      
      return await News.find({
        $or: [
          { headline: { $regex: query, $options: 'i' } },
          { contentSummary: { $regex: query, $options: 'i' } },
          { source: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }).sort({ publishedAt: -1 }).limit(20);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to search news');
    }
  }

  /**
   * Get news by category
   */
  async getNewsByCategory(category: string, page = 1, limit = 10): Promise<any> {
    try {
      return this.getNews(
        { categories: category },
        page,
        limit
      );
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to fetch news by category');
    }
  }

  /**
   * Get recent news (last 7 days)
   */
  async getRecentNews(limit = 5): Promise<any[]> {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      return await News.find({
        publishedAt: { $gte: oneWeekAgo }
      })
      .sort({ publishedAt: -1 })
      .limit(limit);
    } catch (error) {
      throw new AppError(500, 'Failed to fetch recent news');
    }
  }
}