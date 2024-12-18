import { Router } from 'express';
import { UserManagementController } from '../controllers/UserManagementController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();
const userManagementController = new UserManagementController();

router.get('/users', authenticate, userManagementController.getAllUsers);
router.get('/users/:userId', authenticate, userManagementController.getUser);
router.put('/users/:userId/role', authenticate, userManagementController.updateRole);

export default router;