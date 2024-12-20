import { News } from '../models/News.js';
import { AppError } from '../utils/errorHandler.js';

export class NewsUploadService {
  async uploadNews(newsData: Partial<INews>, userId: string): Promise<INews> {
    try {
      // Add validation for required fields
      if (!newsData.headline || !newsData.content || !newsData.source) {
        throw new AppError(400, 'Missing required fields');
      }

      // Create news with metadata
      const news = await News.create({
        ...newsData,
        contentSummary: newsData.content.substring(0, 200) + '...',
        publishedAt: new Date(),
        updatedAt: new Date(),
        author: userId
      });

      return news;
    } catch (error) {
      throw new AppError(500, 'Failed to upload news');
    }
  }
}