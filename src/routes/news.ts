// src/routes/news.ts
import { Router } from 'express';
import { NewsController } from '../controllers/NewsController.js';
import { NewsUploadController } from '../controllers/NewsUploadController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { newsUploadSchema, newsUpdateSchema } from '../schemas/newsSchemas.js';

const router = Router();
const newsController = new NewsController();
const newsUploadController = new NewsUploadController();

// Public routes
router.get('/', newsController.getAll);
router.get('/search', newsController.search);
router.get('/:id', newsController.getById);

// Admin-only routes
router.post(
  '/upload',
  authenticate,
  authorize('admin'),
  validateRequest(newsUploadSchema),
  newsUploadController.upload
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest(newsUpdateSchema),
  newsController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  newsController.delete
);

export default router;