import { Router, type Router as RouterType } from 'express';
import { usersController } from './users.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router: RouterType = Router();

// All routes require authentication
router.use(authenticate);

// Search users
router.get('/search', usersController.search);

// Get user by ID
router.get('/:userId', usersController.getUser);

export default router;
