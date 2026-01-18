import prisma from '../../lib/prisma.js';

const MAX_RECENT_SEARCHES = 10;

export interface RecentSearchResult {
    id: string;
    searchedUser: {
        id: string;
        username: string;
        displayName: string;
    };
    createdAt: Date;
}

export const recentSearchesService = {
    /**
     * Save a recent search (upsert)
     * Updates timestamp if exists, enforces max 10 entries
     */
    async saveRecentSearch(
        userId: string,
        searchedUserId: string
    ): Promise<RecentSearchResult> {
        // Validate that searched user exists and is active
        const searchedUser = await prisma.user.findUnique({
            where: { id: searchedUserId, status: 'ACTIVE' },
            select: { id: true, username: true, displayName: true },
        });

        if (!searchedUser) {
            throw new RecentSearchError('User not found', 404);
        }

        // Cannot search yourself
        if (userId === searchedUserId) {
            throw new RecentSearchError('Cannot add yourself to recent searches', 400);
        }

        // Upsert the recent search
        const recentSearch = await prisma.recentSearch.upsert({
            where: {
                userId_searchedUserId: {
                    userId,
                    searchedUserId,
                },
            },
            update: {
                updatedAt: new Date(),
            },
            create: {
                userId,
                searchedUserId,
            },
            include: {
                searchedUser: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                    },
                },
            },
        });

        // Enforce max entries - delete oldest if over limit
        const allSearches = await prisma.recentSearch.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            select: { id: true },
        });

        if (allSearches.length > MAX_RECENT_SEARCHES) {
            const idsToDelete = allSearches
                .slice(MAX_RECENT_SEARCHES)
                .map((s) => s.id);

            await prisma.recentSearch.deleteMany({
                where: { id: { in: idsToDelete } },
            });
        }

        return {
            id: recentSearch.id,
            searchedUser: recentSearch.searchedUser,
            createdAt: recentSearch.createdAt,
        };
    },

    /**
     * Get recent searches for a user
     * Returns ordered by most recent, joined with user info
     */
    async getRecentSearches(userId: string): Promise<RecentSearchResult[]> {
        const recentSearches = await prisma.recentSearch.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: {
                searchedUser: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                    },
                },
            },
        });

        return recentSearches.map((rs) => ({
            id: rs.id,
            searchedUser: rs.searchedUser,
            createdAt: rs.createdAt,
        }));
    },

    /**
     * Delete a recent search entry
     * Idempotent - returns success even if not found
     */
    async deleteRecentSearch(
        userId: string,
        searchedUserId: string
    ): Promise<void> {
        await prisma.recentSearch.deleteMany({
            where: {
                userId,
                searchedUserId,
            },
        });
    },
};

export class RecentSearchError extends Error {
    constructor(
        message: string,
        public statusCode: number = 400
    ) {
        super(message);
        this.name = 'RecentSearchError';
    }
}
