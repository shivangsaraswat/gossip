import prisma from '../../lib/prisma.js';
import { getRelationshipStatus, type RelationshipStatus } from '../../lib/permissions.js';

export interface UserSearchResult {
    id: string;
    username: string;
    displayName: string;
    relationship: RelationshipStatus;
}

export const usersService = {
    /**
     * Search users by username prefix
     * Returns users with their relationship to the current user
     */
    async searchUsers(
        currentUserId: string,
        query: string,
        limit: number = 20,
        offset: number = 0
    ): Promise<UserSearchResult[]> {
        if (!query || query.length < 1) {
            return [];
        }

        // Case-insensitive prefix match, exclude self, only active users
        const users = await prisma.user.findMany({
            where: {
                username: {
                    startsWith: query.toLowerCase(),
                    mode: 'insensitive',
                },
                id: {
                    not: currentUserId,
                },
                status: 'ACTIVE',
            },
            select: {
                id: true,
                username: true,
                displayName: true,
            },
            take: limit,
            skip: offset,
            orderBy: {
                username: 'asc',
            },
        });

        // Get relationship status for each user
        const results = await Promise.all(
            users.map(async (user) => {
                const relationship = await getRelationshipStatus(currentUserId, user.id);
                return {
                    id: user.id,
                    username: user.username,
                    displayName: user.displayName,
                    relationship,
                };
            })
        );

        return results;
    },

    /**
     * Get user profile by ID
     */
    async getUserById(
        currentUserId: string,
        targetUserId: string
    ): Promise<UserSearchResult | null> {
        const user = await prisma.user.findUnique({
            where: {
                id: targetUserId,
                status: 'ACTIVE',
            },
            select: {
                id: true,
                username: true,
                displayName: true,
            },
        });

        if (!user) {
            return null;
        }

        const relationship = currentUserId === targetUserId
            ? 'not_following' as RelationshipStatus // Self
            : await getRelationshipStatus(currentUserId, targetUserId);

        return {
            ...user,
            relationship,
        };
    },
};
