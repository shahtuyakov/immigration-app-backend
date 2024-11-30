import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '../schemas/authSchemas.js';

const router = Router();
const authController = new AuthController();

// Public routes that don't require authentication
router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh-token', validateRequest(refreshTokenSchema), authController.refreshToken);

// Protected routes that require authentication
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.post('/logout', authenticate, authController.logout);

// Admin-only routes example
router.get('/users', authenticate, authorize('admin'), authController.getAllUsers);

export default router;