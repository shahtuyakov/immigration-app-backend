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

  getUserCases = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cases = await this.caseTrackingService.getUserCases(req.user!.id);
      res.json(createSuccessResponse(cases, 'Cases retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getCaseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { caseId } = req.params;
      const caseDetails = await this.caseTrackingService.getCaseById(req.user!.id, caseId);
      res.json(createSuccessResponse(caseDetails, 'Case details retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };
}