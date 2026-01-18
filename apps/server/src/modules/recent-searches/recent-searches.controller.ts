import type { Request, Response, NextFunction } from 'express';
import { recentSearchesService, RecentSearchError } from './recent-searches.service.js';
import { saveRecentSearchSchema, deleteRecentSearchSchema } from './recent-searches.schema.js';

export const recentSearchesController = {
    /**
     * GET /api/recent-searches
     * Get recent searches for the authenticated user
     */
    async getRecentSearches(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = (req as Request & { userId: string }).userId;
            const recentSearches = await recentSearchesService.getRecentSearches(userId);

            res.status(200).json({
                success: true,
                data: { recentSearches },
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * POST /api/recent-searches
     * Save a recent search
     */
    async saveRecentSearch(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = (req as Request & { userId: string }).userId;

            // Validate request body
            const parsed = saveRecentSearchSchema.safeParse({ body: req.body });
            if (!parsed.success) {
                res.status(400).json({
                    error: parsed.error.errors[0]?.message || 'Invalid request',
                });
                return;
            }

            const { searchedUserId } = parsed.data.body;
            const recentSearch = await recentSearchesService.saveRecentSearch(userId, searchedUserId);

            res.status(201).json({
                success: true,
                data: { recentSearch },
            });
        } catch (error) {
            if (error instanceof RecentSearchError) {
                res.status(error.statusCode).json({ error: error.message });
                return;
            }
            next(error);
        }
    },

    /**
     * DELETE /api/recent-searches/:searchedUserId
     * Delete a recent search entry
     */
    async deleteRecentSearch(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = (req as Request & { userId: string }).userId;

            // Validate params
            const parsed = deleteRecentSearchSchema.safeParse({ params: req.params });
            if (!parsed.success) {
                res.status(400).json({
                    error: parsed.error.errors[0]?.message || 'Invalid request',
                });
                return;
            }

            const { searchedUserId } = parsed.data.params;
            await recentSearchesService.deleteRecentSearch(userId, searchedUserId);

            res.status(200).json({
                success: true,
            });
        } catch (error) {
            next(error);
        }
    },
};
