import { Request, Response, NextFunction } from 'express';
import { OAuthService } from '../services/OAuthService.js';
import { createSuccessResponse } from '../utils/apiResponse.js';

export class OAuthController {
  private oauthService: OAuthService;

  constructor() {
    this.oauthService = new OAuthService();
  }

  googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idToken } = req.body;
      const { user, tokens } = await this.oauthService.handleGoogleLogin(idToken);
      res.json(createSuccessResponse({ user, tokens }, 'Google login successful'));
    } catch (error) {
      next(error);
    }
  };

  appleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { identityToken } = req.body;
      const { user, tokens } = await this.oauthService.handleAppleLogin(identityToken);
      res.json(createSuccessResponse({ user, tokens }, 'Apple login successful'));
    } catch (error) {
      next(error);
    }
  };
}