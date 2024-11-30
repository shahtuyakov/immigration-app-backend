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
      // The authenticate middleware ensures req.user exists
      const updatedUser = await this.authService.updateProfile(req.user!.id, req.body);
      
      res.json(createSuccessResponse({
        user: toUserResponseDTO(updatedUser)
      }, 'Profile updated successfully', req));
    } catch (error) {
      next(error);
    }
  };

  initiateEmailChange = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { newEmail, currentPassword } = req.body;
      
      await this.authService.initiateEmailChange(
        req.user!.id,
        newEmail,
        currentPassword
      );
      
      res.json(createSuccessResponse(
        null,
        'Email verification link has been sent to your new email address',
        req
      ));
    } catch (error) {
      next(error);
    }
  };

  verifyEmailChange = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      
      await this.authService.verifyEmailChange(req.user!.id, token);
      
      res.json(createSuccessResponse(
        null,
        'Email address has been successfully updated',
        req
      ));
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      await this.authService.changePassword(
        req.user!.id,
        currentPassword,
        newPassword
      );
      
      res.json(createSuccessResponse(
        null,
        'Password has been successfully updated',
        req
      ));
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.logout(req.user!.id, req.token!);
      
      res.json(createSuccessResponse(
        null,
        'Successfully logged out',
        req
      ));
    } catch (error) {
      next(error);
    }
  };

  logoutAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.logoutAll(req.user!.id);
      
      res.json(createSuccessResponse(
        null,
        'Successfully logged out from all devices',
        req
      ));
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

  requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.requestPasswordReset(req.body.email);
      res.json(createSuccessResponse(
        null,
        'If your email is registered, you will receive password reset instructions'
      ));
    } catch (error) {
      next(error);
    }
  };
  
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body;
      await this.authService.resetPassword(token, newPassword);
      res.json(createSuccessResponse(
        null,
        'Password has been reset successfully'
      ));
    } catch (error) {
      next(error);
    }
  };
}