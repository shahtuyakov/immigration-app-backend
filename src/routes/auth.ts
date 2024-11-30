import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { 
  registerSchema, 
  loginSchema, 
  passwordChangeSchema,
  refreshTokenSchema,
  emailChangeSchema
} from '../schemas/authSchemas.js';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh-token', validateRequest(refreshTokenSchema), authController.refreshToken);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.post('/password/change', authenticate, validateRequest(passwordChangeSchema), authController.changePassword);
router.post('/email/change', authenticate, validateRequest(emailChangeSchema), authController.initiateEmailChange);
router.post('/logout', authenticate, authController.logout);
router.post('/logout-all', authenticate, authController.logoutAll);

export default router;