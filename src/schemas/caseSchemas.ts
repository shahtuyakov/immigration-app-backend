import { z } from 'zod';

export const trackCaseSchema = z.object({
  body: z.object({
    caseNumber: z
      .string()
  })
});