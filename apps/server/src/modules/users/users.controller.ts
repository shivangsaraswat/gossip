import type { Request, Response, NextFunction } from 'express';
import { usersService } from './users.service.js';

export const usersController = {
    async search(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = (req as Request & { userId: string }).userId;
            const query = req.query.query as string | undefined;
            const limit = parseInt(req.query.limit as string) || 20;
            const offset = parseInt(req.query.offset as string) || 0;

            if (!query) {
                res.status(400).json({
                    error: 'Query parameter is required',
                });
                return;
            }

            const users = await usersService.searchUsers(userId, query, limit, offset);
            res.status(200).json({
                success: true,
                data: { users },
            });
        } catch (error) {
            next(error);
        }
    },

    async getUser(
        req: Request<{ userId: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const currentUserId = (req as unknown as Request & { userId: string }).userId;
            const user = await usersService.getUserById(currentUserId, req.params.userId);

            if (!user) {
                res.status(404).json({
                    error: 'User not found',
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    },
};
