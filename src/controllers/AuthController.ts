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