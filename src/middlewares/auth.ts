import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler.js';
import { AuthService } from '../services/AuthService.js';

const authService = new AuthService();

// Enhanced type for authenticated requests
declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: string;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for token in headers
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'Authentication required');
    }

    // Extract and verify token
    const token = authHeader.split(' ')[1];
    const user = await authService.verifyToken(token);

    // Attach user and token to request
    req.user = user;
    req.token = token;
    
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