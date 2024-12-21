import { ImmigrationCase } from '../models/ImmigrationCase.js';
import { USCISApiService } from './USCISApiService.js';
import { AppError } from '../utils/errorHandler.js';

export class CaseTrackingService {
  private uscisService: USCISApiService;

  constructor() {
    this.uscisService = new USCISApiService();
  }

  async addCase(userId: string, caseData: { caseNumber: string; name: string }): Promise<IImmigrationCase> {
    try {
      // Get USCIS status
      const uscisData = await this.uscisService.getCaseStatus(caseData.caseNumber);

      // Create case with combined data
      const newCase = await ImmigrationCase.create({
        userId,
        caseNumber: caseData.caseNumber,
        name: caseData.name,
        status: uscisData.status,
        description: uscisData.description,
        formNumber: uscisData.formNumber,
        formTitle: uscisData.formTitle,
        lastUpdated: new Date()
      });

      return newCase;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to create case');
    }
  }

  async getUserCases(userId: string): Promise<IImmigrationCase[]> {
    return ImmigrationCase.find({ userId }).sort({ lastUpdated: -1 });
  }

  async refreshCaseStatus(caseId: string): Promise<IImmigrationCase> {
    const case_ = await ImmigrationCase.findById(caseId);
    if (!case_) throw new AppError(404, 'Case not found');

    const uscisData = await this.uscisService.getCaseStatus(case_.caseNumber);
    
    case_.status = uscisData.status;
    case_.description = uscisData.description;
    case_.lastUpdated = new Date();
    
    await case_.save();
    return case_;
  }
}