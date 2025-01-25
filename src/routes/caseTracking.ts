import { Router } from 'express';
import { CaseTrackingController } from '../controllers/CaseTrackingController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();
const controller = new CaseTrackingController();

router.use(authenticate);

// router.post('/', controller.addCase);
// router.get('/', controller.getCases);
// router.patch('/:id/refresh', controller.refreshStatus);

export default router;