import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errorHandler.js';
import { AuthService } from '../services/AuthService.js';
import { User, IUser } from '../models/User.js';
import { env } from '../config/env.js';
import mongoose from 'mongoose';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      token?: string;
    }
  }
}

const authService = new AuthService();

// Token validation middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Verify token and get user data
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        throw new AppError(401, 'User not found or inactive');
      }

      // Check if token is in refresh tokens list (for logout functionality)
      if (!user.refreshTokens.includes(token)) {
        throw new AppError(401, 'Token has been invalidated');
      }

      // Attach user and token to request
      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError(401, 'Token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError(401, 'Invalid token');
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Insufficient permissions'));
    }

    next();
  };
};

// Permission-based authorization middleware
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required'));
    }

    if (!req.user.hasPermission(permission)) {
      return next(new AppError(403, 'Insufficient permissions'));
    }

    next();
  };
};

// Resource ownership middleware
export const checkOwnership = (resourceType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError(401, 'Authentication required');
      }

      // Example resource ownership check
      const resource = await mongoose.model(resourceType).findById(resourceId);
      
      if (!resource) {
        throw new AppError(404, 'Resource not found');
      }

      if (resource.userId.toString() !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError(403, 'Not authorized to access this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};