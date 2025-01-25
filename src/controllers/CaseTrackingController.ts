import { Request, Response, NextFunction } from 'express';
import { CaseTrackingService } from '../services/CaseTrackingService.js';
import { createSuccessResponse } from '../utils/apiResponse.js';

export class CaseTrackingController {
  private caseTrackingService: CaseTrackingService;

  constructor() {
    this.caseTrackingService = new CaseTrackingService();
  }
  trackCase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { caseNumber } = req.body;
      const caseResult = await this.caseTrackingService.trackCase(req.user!.id, caseNumber);
      res.json(createSuccessResponse(caseResult, 'Case tracked successfully'));
    } catch (error) {
      next(error);
    }
  };
}