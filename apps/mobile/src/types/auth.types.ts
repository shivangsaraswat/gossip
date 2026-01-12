/**
 * Auth Status Enum
 * The application must support exactly these states
 */
export type AuthStatus =
    | 'loading'              // App bootstrapping
    | 'logged_out'           // No valid session
    | 'pending_verification' // User exists but not OTP-verified
    | 'active';              // Fully authenticated

/**
 * User interface (matches backend SafeUser)
 */
export interface User {
    id: string;
    email: string;
    username: string;
    displayName: string;
    status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED';
    createdAt: string;
}

/**
 * Partial user for pending verification state
 */
export interface PartialUser {
    email: string;
}

/**
 * Auth tokens
 */
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

/**
 * Session response from /api/auth/session
 */
export interface SessionResponse {
    authenticated: boolean;
    status?: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED';
    user?: User | PartialUser;
}

/**
 * Auth store state
 */
export interface AuthState {
    status: AuthStatus;
    user: User | PartialUser | null;
    accessToken: string | null;
    refreshToken: string | null;
}

/**
 * Auth store actions
 */
export interface AuthActions {
    initializeSession: () => Promise<void>;
    setSession: (tokens: AuthTokens, user: User | PartialUser, status: AuthStatus) => Promise<void>;
    clearSession: () => Promise<void>;
    logout: () => Promise<void>;
}

/**
 * Complete auth store type
 */
export type AuthStore = AuthState & AuthActions;
