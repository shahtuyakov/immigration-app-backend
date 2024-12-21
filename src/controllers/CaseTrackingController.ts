import { Request, Response, NextFunction } from 'express';
import { CaseTrackingService } from '../services/CaseTrackingService.js';
import { createSuccessResponse } from '../utils/apiResponse.js';

export class CaseTrackingController {
  private caseTrackingService: CaseTrackingService;

  constructor() {
    this.caseTrackingService = new CaseTrackingService();
  }

  addCase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { caseNumber, name } = req.body;
      const case_ = await this.caseTrackingService.addCase(req.user!.id, { caseNumber, name });
      res.status(201).json(createSuccessResponse(case_, 'Case added successfully'));
    } catch (error) {
      next(error);
    }
  };

  getCases = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cases = await this.caseTrackingService.getUserCases(req.user!.id);
      res.json(createSuccessResponse({ cases }));
    } catch (error) {
      next(error);
    }
  };

  refreshStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const case_ = await this.caseTrackingService.refreshCaseStatus(req.params.id);
      res.json(createSuccessResponse(case_, 'Case status updated'));
    } catch (error) {
      next(error);
    }
  };
}