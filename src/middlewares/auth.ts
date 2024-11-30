import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any; // We'll type this properly when implementing authentication
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // We'll implement the actual authentication logic later
    // This is just the structure
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new AppError(401, 'Authentication required');
    }

    // We'll add token verification logic here
    
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Not authorized'));
    }
    
    next();
  };
};