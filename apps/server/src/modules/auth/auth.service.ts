import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import { emailService } from '../../services/email.service.js';
import type { RegisterInput, LoginInput, VerifyOtpInput } from './auth.schema.js';
import type { User, AccountStatus } from '@prisma/client';

const SALT_ROUNDS = 12;

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface SafeUser {
    id: string;
    email: string;
    username: string;
    displayName: string;
    status: AccountStatus;
    createdAt: Date;
}

function toSafeUser(user: User): SafeUser {
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        status: user.status,
        createdAt: user.createdAt,
    };
}

function generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
}

function generateAccessToken(userId: string): string {
    return jwt.sign({ userId, type: 'access' }, env.JWT_SECRET, {
        expiresIn: 900, // 15 minutes in seconds
    });
}

function generateRefreshToken(userId: string): string {
    return jwt.sign({ userId, type: 'refresh' }, env.JWT_REFRESH_SECRET, {
        expiresIn: 604800, // 7 days in seconds
    });
}

export const authService = {
    async register(input: RegisterInput): Promise<{ user: SafeUser; message: string }> {
        // Check if email already exists
        const existingEmail = await prisma.user.findUnique({
            where: { email: input.email },
        });
        if (existingEmail) {
            throw new AuthError('Email already registered', 409);
        }

        // Check if username already exists
        const existingUsername = await prisma.user.findUnique({
            where: { username: input.username },
        });
        if (existingUsername) {
            throw new AuthError('Username already taken', 409);
        }

        // Hash password
        const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

        // Create user and OTP in transaction
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: input.email,
                    username: input.username,
                    displayName: input.displayName,
                    passwordHash,
                    status: 'PENDING_VERIFICATION',
                },
            });

            // Generate and store OTP
            const otpCode = generateOtp();
            const expiresAt = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000);

            await tx.otpCode.create({
                data: {
                    userId: newUser.id,
                    code: otpCode,
                    type: 'EMAIL_VERIFICATION',
                    expiresAt,
                },
            });

            // In development, log OTP to console for testing
            if (env.NODE_ENV === 'development') {
                console.log('═══════════════════════════════════════');
                console.log(`📧 OTP for ${input.email}: ${otpCode}`);
                console.log('═══════════════════════════════════════');
            } else {
                // Send verification email in production
                await emailService.sendVerificationEmail(input.email, otpCode, input.displayName);
            }

            return newUser;
        });

        return {
            user: toSafeUser(user),
            message: 'Registration successful. Please check your email for verification code.',
        };
    },

    async verifyOtp(input: VerifyOtpInput): Promise<{ user: SafeUser; tokens: AuthTokens }> {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: input.email },
        });
        if (!user) {
            throw new AuthError('User not found', 404);
        }

        if (user.status === 'ACTIVE') {
            throw new AuthError('Email already verified', 400);
        }

        if (user.status === 'SUSPENDED') {
            throw new AuthError('Account suspended', 403);
        }

        // Find valid OTP
        const otp = await prisma.otpCode.findFirst({
            where: {
                userId: user.id,
                code: input.code,
                type: 'EMAIL_VERIFICATION',
                usedAt: null,
                expiresAt: { gt: new Date() },
            },
        });

        if (!otp) {
            throw new AuthError('Invalid or expired verification code', 400);
        }

        // Activate user and mark OTP as used
        const [updatedUser] = await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { status: 'ACTIVE' },
            }),
            prisma.otpCode.update({
                where: { id: otp.id },
                data: { usedAt: new Date() },
            }),
        ]);

        // Generate tokens and create session
        const tokens = await createSession(updatedUser.id);

        return {
            user: toSafeUser(updatedUser),
            tokens,
        };
    },

    async resendOtp(email: string): Promise<{ message: string }> {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Don't reveal if email exists
            return { message: 'If an account exists, a verification code has been sent.' };
        }

        if (user.status === 'ACTIVE') {
            throw new AuthError('Email already verified', 400);
        }

        if (user.status === 'SUSPENDED') {
            throw new AuthError('Account suspended', 403);
        }

        // Invalidate existing OTPs
        await prisma.otpCode.updateMany({
            where: {
                userId: user.id,
                type: 'EMAIL_VERIFICATION',
                usedAt: null,
            },
            data: { usedAt: new Date() },
        });

        // Generate new OTP
        const otpCode = generateOtp();
        const expiresAt = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000);

        await prisma.otpCode.create({
            data: {
                userId: user.id,
                code: otpCode,
                type: 'EMAIL_VERIFICATION',
                expiresAt,
            },
        });

        // In development, log OTP to console for testing
        if (env.NODE_ENV === 'development') {
            console.log('═══════════════════════════════════════');
            console.log(`📧 RESEND OTP for ${email}: ${otpCode}`);
            console.log('═══════════════════════════════════════');
        } else {
            await emailService.sendVerificationEmail(email, otpCode, user.displayName);
        }

        return { message: 'If an account exists, a verification code has been sent.' };
    },

    async login(input: LoginInput, deviceInfo?: string, ipAddress?: string): Promise<{ user: SafeUser; tokens: AuthTokens }> {
        // Find user by email or username
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: input.identifier }, { username: input.identifier.toLowerCase() }],
            },
        });

        if (!user) {
            throw new AuthError('Invalid credentials', 401);
        }

        // Verify password
        const validPassword = await bcrypt.compare(input.password, user.passwordHash);
        if (!validPassword) {
            throw new AuthError('Invalid credentials', 401);
        }

        // Check account status
        if (user.status === 'PENDING_VERIFICATION') {
            throw new AuthError('Please verify your email before logging in', 403);
        }

        if (user.status === 'SUSPENDED') {
            throw new AuthError('Account suspended', 403);
        }

        // Generate tokens and create session
        const tokens = await createSession(user.id, deviceInfo, ipAddress);

        return {
            user: toSafeUser(user),
            tokens,
        };
    },

    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        // Verify refresh token
        let payload: { userId: string; type: string };
        try {
            payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as typeof payload;
        } catch {
            throw new AuthError('Invalid refresh token', 401);
        }

        if (payload.type !== 'refresh') {
            throw new AuthError('Invalid token type', 401);
        }

        // Find session
        const session = await prisma.session.findUnique({
            where: { refreshToken },
            include: { user: true },
        });

        if (!session || session.expiresAt < new Date()) {
            throw new AuthError('Session expired or invalid', 401);
        }

        if (session.user.status !== 'ACTIVE') {
            throw new AuthError('Account not active', 403);
        }

        // Generate new access token (rotate refresh token for security)
        const newAccessToken = generateAccessToken(session.userId);
        const newRefreshToken = generateRefreshToken(session.userId);

        // Update session with new refresh token
        await prisma.session.update({
            where: { id: session.id },
            data: {
                refreshToken: newRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    },

    async logout(refreshToken: string): Promise<{ message: string }> {
        await prisma.session.deleteMany({
            where: { refreshToken },
        });

        return { message: 'Logged out successfully' };
    },

    async getMe(userId: string): Promise<SafeUser> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new AuthError('User not found', 404);
        }

        return toSafeUser(user);
    },

    verifyAccessToken(token: string): { userId: string } {
        try {
            const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string; type: string };
            if (payload.type !== 'access') {
                throw new AuthError('Invalid token type', 401);
            }
            return { userId: payload.userId };
        } catch {
            throw new AuthError('Invalid access token', 401);
        }
    },

    async checkUsernameAvailable(username: string): Promise<{ available: boolean }> {
        const normalizedUsername = username.toLowerCase();

        const existingUser = await prisma.user.findUnique({
            where: { username: normalizedUsername },
            select: { id: true },
        });

        return { available: !existingUser };
    },

    async getSessionStatus(userId?: string): Promise<{
        authenticated: boolean;
        status?: string;
        user?: Partial<SafeUser>;
    }> {
        if (!userId) {
            return { authenticated: false };
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return { authenticated: false };
        }

        if (user.status === 'PENDING_VERIFICATION') {
            return {
                authenticated: true,
                status: 'PENDING_VERIFICATION',
                user: { email: user.email },
            };
        }

        return {
            authenticated: true,
            status: user.status,
            user: toSafeUser(user),
        };
    },
};

async function createSession(userId: string, deviceInfo?: string, ipAddress?: string): Promise<AuthTokens> {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.session.create({
        data: {
            userId,
            refreshToken,
            deviceInfo,
            ipAddress,
            expiresAt,
        },
    });

    return { accessToken, refreshToken };
}

export class AuthError extends Error {
    constructor(
        message: string,
        public statusCode: number = 400
    ) {
        super(message);
        this.name = 'AuthError';
    }
}
