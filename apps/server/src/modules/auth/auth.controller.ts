import type { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import type {
    RegisterInput,
    LoginInput,
    VerifyOtpInput,
    ResendOtpInput,
    RefreshTokenInput,
} from './auth.schema.js';

export const authController = {
    async register(
        req: Request<object, object, RegisterInput>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const result = await authService.register(req.body);
            res.status(201).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async verifyOtp(
        req: Request<object, object, VerifyOtpInput>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const result = await authService.verifyOtp(req.body);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async resendOtp(
        req: Request<object, object, ResendOtpInput>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const result = await authService.resendOtp(req.body.email);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async login(
        req: Request<object, object, LoginInput>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const deviceInfo = req.headers['user-agent'];
            const ipAddress = req.ip || req.socket.remoteAddress;
            const result = await authService.login(req.body, deviceInfo, ipAddress);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async refresh(
        req: Request<object, object, RefreshTokenInput>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const tokens = await authService.refreshToken(req.body.refreshToken);
            res.status(200).json({
                success: true,
                data: { tokens },
            });
        } catch (error) {
            next(error);
        }
    },

    async logout(
        req: Request<object, object, RefreshTokenInput>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const result = await authService.logout(req.body.refreshToken);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async me(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // userId is set by auth middleware
            const userId = (req as Request & { userId: string }).userId;
            const user = await authService.getMe(userId);
            res.status(200).json({
                success: true,
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    },
};
