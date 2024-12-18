import { News } from '../models/News.js';
import { AppError } from '../utils/errorHandler.js';

export class NewsService {
  // Create
  async createNews(newsData: Partial<INews>): Promise<INews> {
    try {
      const news = await News.create(newsData);
      return news;
    } catch (error) {
      throw new AppError(400, 'Failed to create news item');
    }
  }

  // Read - Get all with pagination and filters
  async getNews(filters: any = {}, page = 1, limit = 10): Promise<{ news: INews[]; total: number }> {
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

  // Read - Get single
  async getNewsById(id: string): Promise<INews> {
    const news = await News.findById(id);
    if (!news) throw new AppError(404, 'News item not found');
    return news;
  }

  // Update
  async updateNews(id: string, updateData: Partial<INews>): Promise<INews> {
    const news = await News.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!news) throw new AppError(404, 'News item not found');
    return news;
  }

  // Delete
  async deleteNews(id: string): Promise<void> {
    const news = await News.findByIdAndDelete(id);
    if (!news) throw new AppError(404, 'News item not found');
  }

  // Search by keywords
  async searchNews(query: string): Promise<INews[]> {
    return News.find({
      $or: [
        { headline: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    });
  }

  // Filter by category
  async getNewsByCategory(category: string): Promise<INews[]> {
    return News.find({ categories: category });
  }
}