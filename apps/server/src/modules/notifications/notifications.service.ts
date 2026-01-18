import prisma from '../../lib/prisma.js';

export interface NotificationWithActor {
    id: string;
    type: string;
    referenceId: string | null;
    isRead: boolean;
    createdAt: Date;
    actor: {
        id: string;
        username: string;
        displayName: string;
    };
}

export const notificationsService = {
    /**
     * Create a notification
     */
    async createNotification(
        userId: string,
        actorId: string,
        type: 'CONNECTION_REQUEST',
        referenceId?: string
    ): Promise<void> {
        await prisma.notification.create({
            data: {
                userId,
                actorId,
                type,
                referenceId,
            },
        });
    },

    /**
     * Get notifications for a user
     */
    async getNotifications(userId: string): Promise<NotificationWithActor[]> {
        const notifications = await prisma.notification.findMany({
            where: { userId },
            include: {
                actor: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return notifications.map((n) => ({
            id: n.id,
            type: n.type,
            referenceId: n.referenceId,
            isRead: n.isRead,
            createdAt: n.createdAt,
            actor: n.actor,
        }));
    },

    /**
     * Mark a notification as read
     */
    async markAsRead(userId: string, notificationId: string): Promise<void> {
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
        });

        if (!notification || notification.userId !== userId) {
            throw new NotificationError('Notification not found', 404);
        }

        await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
    },

    /**
     * Delete notifications by reference ID
     * Used when follow request is accepted/rejected
     */
    async deleteByReferenceId(referenceId: string): Promise<void> {
        await prisma.notification.deleteMany({
            where: { referenceId },
        });
    },

    /**
     * Delete notification for a specific user and reference
     */
    async deleteNotification(userId: string, referenceId: string): Promise<void> {
        await prisma.notification.deleteMany({
            where: { userId, referenceId },
        });
    },
};

export class NotificationError extends Error {
    constructor(
        message: string,
        public statusCode: number = 400
    ) {
        super(message);
        this.name = 'NotificationError';
    }
}
