import type { Request, Response, NextFunction } from 'express';
import { notificationsService, NotificationError } from './notifications.service.js';

export const notificationsController = {
    /**
     * GET /api/notifications
     */
    async getNotifications(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = (req as Request & { userId: string }).userId;
            const notifications = await notificationsService.getNotifications(userId);

            res.status(200).json({
                success: true,
                data: { notifications },
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * PATCH /api/notifications/:id/read
     */
    async markAsRead(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = (req as Request & { userId: string }).userId;
            const id = req.params.id as string;

            await notificationsService.markAsRead(userId, id);

            res.status(200).json({
                success: true,
            });
        } catch (error) {
            if (error instanceof NotificationError) {
                res.status(error.statusCode).json({ error: error.message });
                return;
            }
            next(error);
        }
    },
};
