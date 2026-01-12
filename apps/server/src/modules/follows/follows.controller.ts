import type { Request, Response, NextFunction } from 'express';
import { followsService, FollowError } from './follows.service.js';
import type {
    SendFollowRequestInput,
    AcceptFollowRequestInput,
    RejectFollowRequestInput,
    UnfollowInput,
    CancelFollowRequestInput,
} from './follows.schema.js';

export const followsController = {
    async sendRequest(
        req: Request<object, object, SendFollowRequestInput>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = (req as Request & { userId: string }).userId;
            const result = await followsService.sendFollowRequest(userId, req.body.userId);
            res.status(201).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async acceptRequest(
        req: Request<object, object, AcceptFollowRequestInput>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = (req as Request & { userId: string }).userId;
            const result = await followsService.acceptFollowRequest(userId, req.body.requestId);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async rejectRequest(
        req: Request<object, object, RejectFollowRequestInput>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = (req as Request & { userId: string }).userId;
            const result = await followsService.rejectFollowRequest(userId, req.body.requestId);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async unfollow(
        req: Request<object, object, UnfollowInput>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = (req as Request & { userId: string }).userId;
            const result = await followsService.unfollow(userId, req.body.userId);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async cancelRequest(
        req: Request<object, object, CancelFollowRequestInput>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = (req as Request & { userId: string }).userId;
            const result = await followsService.cancelFollowRequest(userId, req.body.userId);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async getStatus(
        req: Request<{ userId: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const currentUserId = (req as unknown as Request & { userId: string }).userId;
            const result = await followsService.getStatus(currentUserId, req.params.userId);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async getPendingRequests(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = (req as Request & { userId: string }).userId;
            const requests = await followsService.getPendingRequests(userId);
            res.status(200).json({
                success: true,
                data: { requests },
            });
        } catch (error) {
            next(error);
        }
    },
};

export { FollowError };
