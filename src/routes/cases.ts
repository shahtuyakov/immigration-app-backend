import { Router } from 'express';
import { CaseTrackingController } from '../controllers/CaseTrackingController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { trackCaseSchema } from '../schemas/caseSchemas.js';

const router = Router();
const caseTrackingController = new CaseTrackingController();

// Fix: Use the controller method directly
router.post(
  '/track',
  authenticate,
  validateRequest(trackCaseSchema),
  caseTrackingController.trackCase  // This was likely undefined before
);

export default router;