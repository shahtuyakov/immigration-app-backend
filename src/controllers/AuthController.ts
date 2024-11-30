import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService.js';
import { createSuccessResponse } from '../utils/apiResponse.js';
import { toUserResponseDTO } from '../interfaces/dtos/UserDTO.js';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, tokens } = await this.authService.register(req.body);
      res.status(201).json(createSuccessResponse({
        user: toUserResponseDTO(user),
        tokens
      }, 'Registration successful', req));
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, tokens } = await this.authService.login(req.body);
      res.json(createSuccessResponse({
        user: toUserResponseDTO(user),
        tokens
      }, 'Login successful', req));
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.user is set by authenticate middleware
      res.json(createSuccessResponse({
        user: toUserResponseDTO(req.user)
      }, 'Profile retrieved successfully', req));
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedUser = await this.authService.updateProfile(req.user.id, req.body);
      res.json(createSuccessResponse({
        user: toUserResponseDTO(updatedUser)
      }, 'Profile updated successfully', req));
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // In a more complex implementation, you might want to invalidate the token
      // For now, we'll just send a success response
      res.json(createSuccessResponse(null, 'Logout successful', req));
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.authService.getAllUsers();
      res.json(createSuccessResponse({
        users: users.map(toUserResponseDTO)
      }, 'Users retrieved successfully', req));
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken } = await this.authService.refreshAccessToken(req.body.refreshToken);
      res.json(createSuccessResponse({
        accessToken
      }, 'Token refreshed successfully', req));
    } catch (error) {
      next(error);
    }
  };
}