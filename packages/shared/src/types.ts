/**
 * Account status enum matching Prisma schema
 */
export type AccountStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED';

/**
 * Public user profile (safe to share)
 */
export interface User {
    id: string;
    email: string;
    username: string;
    displayName: string;
    status: AccountStatus;
    createdAt: string;
}

/**
 * JWT token pair
 */
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    details?: Array<{ field: string; message: string }>;
}

/**
 * Auth endpoints request/response types
 */
export interface RegisterRequest {
    email: string;
    username: string;
    displayName: string;
    password: string;
}

export interface RegisterResponse {
    user: User;
    message: string;
}

export interface LoginRequest {
    identifier: string; // email or username
    password: string;
}

export interface LoginResponse {
    user: User;
    tokens: AuthTokens;
}

export interface VerifyOtpRequest {
    email: string;
    code: string;
}

export interface VerifyOtpResponse {
    user: User;
    tokens: AuthTokens;
}

export interface ResendOtpRequest {
    email: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    tokens: AuthTokens;
}

export interface MeResponse {
    user: User;
}
