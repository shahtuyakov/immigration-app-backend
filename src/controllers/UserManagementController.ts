import { Request, Response, NextFunction } from 'express';
import { UserManagementService } from '../services/UserManagementService.js';
import { createSuccessResponse } from '../utils/apiResponse.js';

export class UserManagementController {
  private userManagementService: UserManagementService;

  constructor() {
    this.userManagementService = new UserManagementService();
  }

  updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userManagementService.updateUserRole(
        req.params.userId,
        req.body.role
      );
      res.json(createSuccessResponse(user, 'User role updated'));
    } catch (error) {
      next(error);
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userManagementService.getUserById(req.params.userId);
      res.json(createSuccessResponse(user));
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await this.userManagementService.getAllUsers(
        Number(page),
        Number(limit)
      );
      res.json(createSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  };
}