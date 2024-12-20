import { Request, Response, NextFunction } from 'express';
import { NewsService } from '../services/NewsService.js';
import { createSuccessResponse } from '../utils/apiResponse.js';

export class NewsController {
  private newsService: NewsService;

  constructor() {
    this.newsService = new NewsService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const news = await this.newsService.createNews(req.body);
      res.status(201).json(createSuccessResponse(news, 'News created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, category, search } = req.query;
      const filters = category ? { categories: category } : {};
      const result = await this.newsService.getNews(filters, Number(page), Number(limit));
      res.json(createSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const news = await this.newsService.getNewsById(req.params.id);
      res.json(createSuccessResponse(news));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const news = await this.newsService.updateNews(
        req.params.id, // Changed from req.body.id
        req.body
      );
      res.json(createSuccessResponse(news, 'News updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.newsService.deleteNews(req.params.id);
      res.json(createSuccessResponse(null, 'News deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const news = await this.newsService.searchNews(req.query.q as string);
      res.json(createSuccessResponse(news));
    } catch (error) {
      next(error);
    }
  };
}