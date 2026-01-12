import { create } from 'zustand';
import { api, setOnAuthFailure } from '../lib/api';
import { saveTokens, getTokens, clearTokens } from '../lib/secureStorage';
import type {
    AuthStore,
    AuthStatus,
    AuthTokens,
    User,
    PartialUser,
    SessionResponse,
} from '../types';

/**
 * Zustand Auth Store
 * Single source of truth for authentication state
 */
export const useAuthStore = create<AuthStore>((set, get) => {
    // Set up auth failure callback
    setOnAuthFailure(() => {
        get().clearSession();
    });

    return {
        // Initial state
        status: 'loading' as AuthStatus,
        user: null,
        accessToken: null,
        refreshToken: null,

        /**
         * Initialize session on app launch
         * Follows exact resolver algorithm from spec
         */
        initializeSession: async () => {
            try {
                // Step 1: Set status to loading
                set({ status: 'loading' });

                // Step 2: Load tokens from SecureStore
                const tokens = await getTokens();

                // Step 3: If no tokens, set logged_out and exit
                if (!tokens) {
                    set({ status: 'logged_out', user: null, accessToken: null, refreshToken: null });
                    return;
                }

                // Store tokens in memory
                set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });

                // Step 4: Call GET /api/auth/session
                const response = await api.get<SessionResponse>('/api/auth/session');
                const session = response.data;

                // Step 5: Based on response, set appropriate state
                if (!session.authenticated) {
                    // Token invalid or expired
                    await clearTokens();
                    set({ status: 'logged_out', user: null, accessToken: null, refreshToken: null });
                    return;
                }

                if (session.status === 'PENDING_VERIFICATION') {
                    set({
                        status: 'pending_verification',
                        user: session.user as PartialUser,
                    });
                    return;
                }

                if (session.status === 'ACTIVE') {
                    set({
                        status: 'active',
                        user: session.user as User,
                    });
                    return;
                }

                // Unknown status - treat as logged out
                await clearTokens();
                set({ status: 'logged_out', user: null, accessToken: null, refreshToken: null });
            } catch (error) {
                // Network error or server down - clear and logout
                await clearTokens();
                set({ status: 'logged_out', user: null, accessToken: null, refreshToken: null });
            }
        },

        /**
         * Set session after successful login/verification
         */
        setSession: async (tokens: AuthTokens, user: User | PartialUser, status: AuthStatus) => {
            // Save tokens to SecureStore
            await saveTokens(tokens.accessToken, tokens.refreshToken);

            // Update store
            set({
                status,
                user,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            });
        },

        /**
         * Clear session (internal use)
         */
        clearSession: async () => {
            await clearTokens();
            set({
                status: 'logged_out',
                user: null,
                accessToken: null,
                refreshToken: null,
            });
        },

        /**
         * Logout (user-initiated)
         */
        logout: async () => {
            try {
                const { refreshToken } = get();
                if (refreshToken) {
                    // Notify server
                    await api.post('/api/auth/logout', { refreshToken });
                }
            } catch {
                // Ignore errors - we're logging out anyway
            } finally {
                await get().clearSession();
            }
        },
    };
});

export default useAuthStore;
