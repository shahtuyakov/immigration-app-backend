// src/services/CaseTrackingService.ts
import mongoose from 'mongoose';
import { ImmigrationCase } from '../models/ImmigrationCase.js';
import { AppError } from '../utils/errorHandler.js';
import { env } from '../config/env.js';
import axios from 'axios';

interface USCISCaseStatus {
  receiptNumber: string;
  formType: string;
  submittedDate: string;
  modifiedDate: string;
  current_case_status_text_en: string;
  current_case_status_desc_en: string;
  current_case_status_text_es: string;
  current_case_status_desc_es: string;
  hist_case_status: any;
}

export class CaseTrackingService {
  private readonly BASE_URL = process.env.USCIS_API_URL;
  private readonly CASE_NUMBER_REGEX = /^[A-Z]{3}[0-9]{9}$/;

  async trackCase(userId: string, caseNumber: string): Promise<ImmigrationCase> {
    try {
      const token = await this.getUSCISToken();
      const caseData = await this.fetchCaseStatus(caseNumber, token);
      return await this.saveCase(userId, caseData);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to track case');
    }
  }

  private async getUSCISToken(): Promise<string> {
    try {
      const params = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: env.USCIS_CLIENT_ID!,
        client_secret: env.USCIS_CLIENT_SECRET!
      });

      const response = await axios.post(
        `${this.BASE_URL}/oauth/accesstoken`,
        params,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );

      if (!response.data.access_token) {
        throw new AppError(401, 'Failed to get USCIS token');
      }

      return response.data.access_token;
    } catch (error) {
      console.error('USCIS token error:', error.response?.data || error.message);
      throw new AppError(500, 'USCIS authentication failed');
    }
  }

  private async fetchCaseStatus(caseNumber: string, token: string): Promise<USCISCaseStatus> {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/case-status/${caseNumber}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.data.case_status) {
        throw new AppError(404, 'Case status not found');
      }

      return response.data.case_status;
    } catch (error) {
      console.error('USCIS case fetch error:', error.response?.data || error.message);
      if (error.response?.status === 404) {
        throw new AppError(404, 'Case not found in USCIS system');
      }
      throw new AppError(500, 'Failed to fetch case from USCIS');
    }
  }

  private async saveCase(userId: string, caseData: USCISCaseStatus): Promise<ImmigrationCase> {
    const caseUpdate: Partial<ImmigrationCase> = {
      userId: new mongoose.Types.ObjectId(userId),
      caseNumber: caseData.receiptNumber,
      name: caseData.receiptNumber,
      formType: caseData.formType,
      submittedDate: new Date(caseData.submittedDate),
      modifiedDate: new Date(caseData.modifiedDate),
      currentStatusTextEn: caseData.current_case_status_text_en,
      currentStatusDescEn: caseData.current_case_status_desc_en,
      currentStatusTextEs: caseData.current_case_status_text_es,
      currentStatusDescEs: caseData.current_case_status_desc_es,
      historyStatus: caseData.hist_case_status
    };

    try {
      const existingCase = await ImmigrationCase.findOne({ 
        userId, 
        caseNumber: caseData.receiptNumber 
      });

      if (existingCase) {
        return await ImmigrationCase.findByIdAndUpdate(
          existingCase._id,
          caseUpdate,
          { new: true, runValidators: true }
        );
      }

      return await ImmigrationCase.create(caseUpdate);
    } catch (error) {
      console.error('Case save error:', error);
      throw new AppError(500, 'Failed to save case data');
    }
  }

  async getUserCases(userId: string): Promise<ImmigrationCase[]> {
    try {
      return await ImmigrationCase.find({ userId: new mongoose.Types.ObjectId(userId) })
        .sort({ updatedAt: -1 });
    } catch (error) {
      console.error('Get user cases error:', error);
      throw new AppError(500, 'Failed to fetch user cases');
    }
  }

  async getCaseById(userId: string, caseId: string): Promise<ImmigrationCase> {
    try {
      // First validate if the caseId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(caseId)) {
        throw new AppError(400, 'Invalid case ID format');
      }

      const immigrationCase = await ImmigrationCase.findOne({
        _id: new mongoose.Types.ObjectId(caseId),
        userId: new mongoose.Types.ObjectId(userId)
      });

      if (!immigrationCase) {
        throw new AppError(404, 'Immigration case not found or you do not have access to it');
      }

      return immigrationCase;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Get case by id error:', error);
      throw new AppError(500, 'Failed to fetch case details');
    }
  }
}