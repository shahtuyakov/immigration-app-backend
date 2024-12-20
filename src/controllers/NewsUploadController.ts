import { Request, Response, NextFunction } from 'express';
import { NewsUploadService } from '../services/NewsUploadService.js';
import { createSuccessResponse } from '../utils/apiResponse.js';

export class NewsUploadController {
  private newsUploadService: NewsUploadService;

  constructor() {
    this.newsUploadService = new NewsUploadService();
  }

  upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const news = await this.newsUploadService.uploadNews(req.body, req.user!.id);
      res.status(201).json(createSuccessResponse(news, 'News uploaded successfully'));
    } catch (error) {
      next(error);
    }
  };
}