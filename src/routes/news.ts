import { Router } from 'express';
import { NewsController } from '../controllers/NewsController.js';

const router = Router();
const newsController = new NewsController();

// Public routes
router.get('/', newsController.getAll);
router.get('/search', newsController.search);
router.get('/recent', newsController.getRecent);
router.get('/:id', newsController.getById);

export default router;