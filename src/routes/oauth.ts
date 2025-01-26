import { Router } from 'express';
import { OAuthController } from '../controllers/OAuthController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { oauthSchemas } from '../schemas/oauthSchemas.js';

const router = Router();
const oauthController = new OAuthController();

router.post(
  '/google',
  validateRequest(oauthSchemas.googleLogin),
  oauthController.googleLogin
);

router.post(
  '/apple',
  validateRequest(oauthSchemas.appleLogin),
  oauthController.appleLogin
);

export default router;