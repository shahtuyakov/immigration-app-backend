import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '../schemas/authSchemas.js';

const router = Router();
const authController = new AuthController();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh-token', validateRequest(refreshTokenSchema), authController.refreshToken);

export default router;