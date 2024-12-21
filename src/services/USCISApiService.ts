// src/services/USCISApiService.ts
import axios from 'axios';
import { AppError } from '../utils/errorHandler.js';

export class USCISApiService {
  private readonly BASE_URL = 'https://egov.uscis.gov/casestatus/mycasestatus.do';

  async getCaseStatus(receiptNumber: string) {
    try {
      const formData = new URLSearchParams();
      formData.append('appReceiptNum', receiptNumber);
      formData.append('initCaseSearch', 'CHECK STATUS');

      const response = await axios.post(this.BASE_URL, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        }
      });

      const { data } = response;
      
      if (!data.includes('Your Current Case Status for Receipt Number')) {
        throw new AppError(404, 'Invalid case number');
      }

      // Extract status and description using regex
      const statusMatch = data.match(/<div class="rows text-center">\s*<h1>([^<]+)<\/h1>/);
      const descriptionMatch = data.match(/<div class="rows text-center">\s*<h1>[^<]+<\/h1>\s*<p>([^<]+)<\/p>/);

      const status = statusMatch ? statusMatch[1].trim() : '';
      const description = descriptionMatch ? descriptionMatch[1].trim() : '';

      return {
        status: this.parseStatus(status),
        description,
        formNumber: 'N/A', // These are not available in the HTML response
        formTitle: 'N/A'
      };
    } catch (error) {
      console.error('USCIS API Error:', error);
      throw new AppError(500, 'Failed to fetch USCIS case status');
    }
  }

  private parseStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'Case Was Received': 'pending',
      'Case Is Being Actively Reviewed': 'in-progress',
      'Case Was Approved': 'approved',
      'Case Was Denied': 'rejected',
      'Request for Additional Evidence': 'review'
    };

    for (const [key, value] of Object.entries(statusMap)) {
      if (status.includes(key)) return value;
    }

    return 'pending';
  }
}