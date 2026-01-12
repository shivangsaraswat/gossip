import { z } from 'zod';

// Username: 3-30 chars, lowercase letters, numbers, underscores only
const usernameRegex = /^[a-z0-9_]+$/;

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .regex(usernameRegex, 'Username can only contain lowercase letters, numbers, and underscores')
        .transform((val) => val.toLowerCase()),
    displayName: z
        .string()
        .min(1, 'Display name is required')
        .max(50, 'Display name must be at most 50 characters')
        .trim(),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be at most 100 characters'),
});

export const loginSchema = z.object({
    identifier: z.string().min(1, 'Email or username is required'),
    password: z.string().min(1, 'Password is required'),
});

export const verifyOtpSchema = z.object({
    email: z.string().email('Invalid email address'),
    code: z.string().length(6, 'OTP must be exactly 6 digits'),
});

export const resendOtpSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const usernameAvailableSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores')
        .transform((val) => val.toLowerCase()),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type UsernameAvailableInput = z.infer<typeof usernameAvailableSchema>;
