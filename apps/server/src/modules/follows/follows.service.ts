import prisma from '../../lib/prisma.js';
import { getRelationshipStatus, type RelationshipStatus } from '../../lib/permissions.js';

export class FollowError extends Error {
    constructor(
        message: string,
        public statusCode: number = 400
    ) {
        super(message);
        this.name = 'FollowError';
    }
}

export const followsService = {
    /**
     * Send a follow request to another user
     */
    async sendFollowRequest(senderId: string, receiverId: string): Promise<{ message: string }> {
        // Cannot request self
        if (senderId === receiverId) {
            throw new FollowError('Cannot send follow request to yourself', 400);
        }

        // Check if target user exists
        const targetUser = await prisma.user.findUnique({
            where: { id: receiverId },
        });

        if (!targetUser) {
            throw new FollowError('User not found', 404);
        }

        // Check if already following
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: senderId,
                    followingId: receiverId,
                },
            },
        });

        if (existingFollow) {
            throw new FollowError('You are already following this user', 409);
        }

        // Check if request already exists
        const existingRequest = await prisma.followRequest.findUnique({
            where: {
                senderId_receiverId: {
                    senderId,
                    receiverId,
                },
            },
        });

        if (existingRequest) {
            throw new FollowError('Follow request already sent', 409);
        }

        // Check if there's a pending request from the other user
        // If so, auto-accept by creating mutual follows
        const incomingRequest = await prisma.followRequest.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: receiverId,
                    receiverId: senderId,
                },
            },
        });

        if (incomingRequest) {
            // Auto-accept: create both follow relationships
            await prisma.$transaction([
                prisma.followRequest.delete({
                    where: { id: incomingRequest.id },
                }),
                prisma.follow.create({
                    data: {
                        followerId: senderId,
                        followingId: receiverId,
                    },
                }),
                prisma.follow.create({
                    data: {
                        followerId: receiverId,
                        followingId: senderId,
                    },
                }),
            ]);

            return { message: 'Mutual follow established' };
        }

        // Create follow request
        await prisma.followRequest.create({
            data: {
                senderId,
                receiverId,
            },
        });

        return { message: 'Follow request sent' };
    },

    /**
     * Accept a follow request
     */
    async acceptFollowRequest(currentUserId: string, requestId: string): Promise<{ message: string }> {
        const request = await prisma.followRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            throw new FollowError('Follow request not found', 404);
        }

        // Only receiver can accept
        if (request.receiverId !== currentUserId) {
            throw new FollowError('You cannot accept this request', 403);
        }

        // Delete request and create follow in transaction
        await prisma.$transaction([
            prisma.followRequest.delete({
                where: { id: requestId },
            }),
            prisma.follow.create({
                data: {
                    followerId: request.senderId,
                    followingId: request.receiverId,
                },
            }),
        ]);

        return { message: 'Follow request accepted' };
    },

    /**
     * Reject a follow request
     */
    async rejectFollowRequest(currentUserId: string, requestId: string): Promise<{ message: string }> {
        const request = await prisma.followRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            throw new FollowError('Follow request not found', 404);
        }

        // Only receiver can reject
        if (request.receiverId !== currentUserId) {
            throw new FollowError('You cannot reject this request', 403);
        }

        await prisma.followRequest.delete({
            where: { id: requestId },
        });

        return { message: 'Follow request rejected' };
    },

    /**
     * Unfollow a user
     */
    async unfollow(currentUserId: string, targetUserId: string): Promise<{ message: string }> {
        if (currentUserId === targetUserId) {
            throw new FollowError('Cannot unfollow yourself', 400);
        }

        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            },
        });

        if (!follow) {
            throw new FollowError('You are not following this user', 404);
        }

        await prisma.follow.delete({
            where: { id: follow.id },
        });

        return { message: 'Unfollowed successfully' };
    },

    /**
     * Get relationship status with a user
     */
    async getStatus(currentUserId: string, targetUserId: string): Promise<{ relationship: RelationshipStatus }> {
        if (currentUserId === targetUserId) {
            throw new FollowError('Cannot check relationship with yourself', 400);
        }

        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
        });

        if (!targetUser) {
            throw new FollowError('User not found', 404);
        }

        const relationship = await getRelationshipStatus(currentUserId, targetUserId);
        return { relationship };
    },

    /**
     * Get pending follow requests for current user
     */
    async getPendingRequests(userId: string) {
        const requests = await prisma.followRequest.findMany({
            where: { receiverId: userId },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return requests.map((req) => ({
            id: req.id,
            sender: req.sender,
            createdAt: req.createdAt,
        }));
    },
};
