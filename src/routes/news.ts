import { Router } from 'express';
import { NewsController } from '../controllers/NewsController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();
const newsController = new NewsController();

// Public routes
router.get('/', newsController.getAll);
router.get('/search', newsController.search);
router.get('/:id', newsController.getById);

// Authenticated routes (temporarily removed admin restriction)
router.post('/', authenticate, newsController.create);
router.put('/:id', authenticate, newsController.update);
router.delete('/:id', authenticate, newsController.delete);

export default router;