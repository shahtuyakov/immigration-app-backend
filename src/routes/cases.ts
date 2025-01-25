import { Router } from 'express';
import { CaseTrackingController } from '../controllers/CaseTrackingController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { trackCaseSchema, getCaseByIdSchema } from '../schemas/caseSchemas.js';

const router = Router();
const caseTrackingController = new CaseTrackingController();

// Fix: Use the controller method directly
router.post(
  '/track',
  authenticate,
  validateRequest(trackCaseSchema),
  caseTrackingController.trackCase  // This was likely undefined before
);

// Add these new routes
router.get(
  '/my-cases',
  authenticate,
  caseTrackingController.getUserCases
);

router.get(
  '/:caseId',
  authenticate,
  validateRequest(getCaseByIdSchema),
  caseTrackingController.getCaseById
);

export default router;