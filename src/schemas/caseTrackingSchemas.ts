import { z } from 'zod';

export const addCaseSchema = z.object({
  body: z.object({
    caseNumber: z.string()
      .min(13, 'Case number must be 13 characters')
      .max(13, 'Case number must be 13 characters'),
    name: z.string()
      .min(10, 'Name must be at least 10 characters')
  })
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'in-progress', 'review', 'approved', 'rejected', 'appealing'])
  })
});