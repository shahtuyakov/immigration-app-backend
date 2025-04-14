import { Request, Response, NextFunction } from 'express';
import { NewsService } from '../services/NewsService.js';
import { createSuccessResponse } from '../utils/apiResponse.js';

export class NewsController {
  private newsService: NewsService;

  constructor() {
    this.newsService = new NewsService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, category } = req.query;
      
      let result;
      if (category) {
        result = await this.newsService.getNewsByCategory(
          category as string, 
          Number(page), 
          Number(limit)
        );
      } else {
        result = await this.newsService.getNews(
          {}, 
          Number(page), 
          Number(limit)
        );
      }
      
      res.json(createSuccessResponse(result, 'News retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const news = await this.newsService.getNewsById(req.params.id);
      res.json(createSuccessResponse(news, 'News details retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({
          status: 'error',
          message: 'Search query is required'
        });
      }
      
      const news = await this.newsService.searchNews(query);
      res.json(createSuccessResponse(news, 'Search results retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getRecent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 5;
      const news = await this.newsService.getRecentNews(limit);
      res.json(createSuccessResponse(news, 'Recent news retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };
}