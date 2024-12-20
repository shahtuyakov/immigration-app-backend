// src/schemas/newsSchemas.ts
import { z } from 'zod';

const newsCategories = [
  'Policy Updates',
  'Visa Changes',
  'Immigration Law',
  'Court Decisions',
  'USCIS Updates',
  'Border Updates',
  'Employment Immigration',
  'Family Immigration'
] as const;

export const newsUpdateSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    headline: z
      .string()
      .min(10, "Headline must be at least 10 characters")
      .max(200, "Headline cannot exceed 200 characters")
      .optional(),
    content: z
      .string()
      .min(50, "Content must be at least 50 characters")
      .max(5000, "Content cannot exceed 5000 characters")
      .optional(),
    contentSummary: z
      .string()
      .max(500, "Summary cannot exceed 500 characters")
      .optional(),
    source: z
      .string()
      .min(3, "Source must be at least 3 characters")
      .optional(),
    region: z.string().optional(),
    categories: z.array(z.enum(newsCategories)).optional(),
    tags: z.array(z.string()).optional(),
    imageUrl: z.string().url().optional().nullable(),
  }),
});

export const newsUploadSchema = z.object({
  body: z.object({
    headline: z.string()
      .min(10, 'Headline must be at least 10 characters')
      .max(200, 'Headline cannot exceed 200 characters'),
    content: z.string()
      .min(50, 'Content must be at least 50 characters')
      .max(5000, 'Content cannot exceed 5000 characters'),
    source: z.string()
      .min(3, 'Source must be at least 3 characters'),
    region: z.string(),
    categories: z.array(z.enum(newsCategories)),
    tags: z.array(z.string()).optional(),
    imageUrl: z.string().url().optional().nullable()
  })
});