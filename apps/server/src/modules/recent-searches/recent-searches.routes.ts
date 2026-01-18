import { Router, type Router as RouterType } from 'express';
import { recentSearchesController } from './recent-searches.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router: RouterType = Router();

// All routes require authentication
router.use(authenticate);

// Get recent searches
router.get('/', recentSearchesController.getRecentSearches);

// Save a recent search
router.post('/', recentSearchesController.saveRecentSearch);

// Delete a recent search
router.delete('/:searchedUserId', recentSearchesController.deleteRecentSearch);

export default router;
