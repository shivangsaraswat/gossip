import { Router, type Router as RouterType } from 'express';
import { followsController } from './follows.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import {
    sendFollowRequestSchema,
    acceptFollowRequestSchema,
    rejectFollowRequestSchema,
    unfollowSchema,
    cancelFollowRequestSchema,
} from './follows.schema.js';

const router: RouterType = Router();

// All routes require authentication
router.use(authenticate);

// Send follow request
router.post('/request', validate(sendFollowRequestSchema), followsController.sendRequest);

// Accept follow request
router.post('/accept', validate(acceptFollowRequestSchema), followsController.acceptRequest);

// Reject follow request
router.post('/reject', validate(rejectFollowRequestSchema), followsController.rejectRequest);

// Cancel follow request (for sender)
router.post('/cancel', validate(cancelFollowRequestSchema), followsController.cancelRequest);

// Unfollow
router.post('/unfollow', validate(unfollowSchema), followsController.unfollow);

// Get pending requests
router.get('/requests', followsController.getPendingRequests);

// Get relationship status with a user
router.get('/status/:userId', followsController.getStatus);

export default router;
