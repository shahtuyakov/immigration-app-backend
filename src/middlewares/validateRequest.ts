import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createErrorResponse } from '../utils/apiResponse.js';

export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      
      // Replace request data with validated data
      req.body = validatedData.body;
      req.query = validatedData.query;
      req.params = validatedData.params;
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json(
          createErrorResponse(
            'Validation failed',
            error.errors.map(e => e.message).join(', '),
            req
          )
        );
      }
      next(error);
    }
  };
};