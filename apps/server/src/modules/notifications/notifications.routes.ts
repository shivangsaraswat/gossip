import { Router, type Router as RouterType } from 'express';
import { notificationsController } from './notifications.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router: RouterType = Router();

// All routes require authentication
router.use(authenticate);

// Get notifications
router.get('/', notificationsController.getNotifications);

// Mark notification as read
router.patch('/:id/read', notificationsController.markAsRead);

export default router;
