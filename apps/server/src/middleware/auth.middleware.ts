import type { Request, Response, NextFunction } from 'express';
import { authService, AuthError } from '../modules/auth/auth.service.js';

export interface AuthenticatedRequest extends Request {
    userId: string;
}

export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: 'No token provided',
            });
            return;
        }

        const token = authHeader.substring(7);
        const { userId } = authService.verifyAccessToken(token);

        (req as AuthenticatedRequest).userId = userId;
        next();
    } catch (error) {
        if (error instanceof AuthError) {
            res.status(error.statusCode).json({
                success: false,
                error: error.message,
            });
            return;
        }
        res.status(401).json({
            success: false,
            error: 'Invalid token',
        });
    }
}

export interface OptionalAuthRequest extends Request {
    userId?: string;
}

export function optionalAuthenticate(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // No token provided - continue without userId
            next();
            return;
        }

        const token = authHeader.substring(7);
        const { userId } = authService.verifyAccessToken(token);

        (req as OptionalAuthRequest).userId = userId;
        next();
    } catch {
        // Token invalid or expired - continue without userId
        next();
    }
}
