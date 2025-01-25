import { z } from 'zod';

export const trackCaseSchema = z.object({
  body: z.object({
    caseNumber: z.string()
  })
});

export const getCaseByIdSchema = z.object({
  params: z.object({
    caseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid case ID format')
  })
});