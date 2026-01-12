import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../store';
import type { User, AuthTokens } from '../types';

interface RegisterData {
    email: string;
    username: string;
    displayName: string;
    password: string;
}

interface LoginData {
    identifier: string;
    password: string;
}

interface VerifyOtpData {
    email: string;
    code: string;
}

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const setSession = useAuthStore((state) => state.setSession);

    const checkUsername = useCallback(async (username: string): Promise<boolean> => {
        if (username.length < 3) return false;

        try {
            const response = await api.get('/api/auth/username-available', {
                params: { username },
            });
            return response.data.available;
        } catch {
            return false;
        }
    }, []);

    const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; email?: string }> => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/api/auth/register', data);
            if (response.data.success) {
                return { success: true, email: data.email };
            }
            setError('Registration failed');
            return { success: false };
        } catch (err: any) {
            const message = err.response?.data?.error || 'Registration failed';
            setError(message);
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, []);

    const verifyOtp = useCallback(async (data: VerifyOtpData): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/api/auth/verify-otp', data);
            if (response.data.success) {
                const { user, tokens } = response.data.data;
                await setSession(
                    tokens as AuthTokens,
                    user as User,
                    'active'
                );
                return true;
            }
            setError('Verification failed');
            return false;
        } catch (err: any) {
            const message = err.response?.data?.error || 'Invalid code';
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [setSession]);

    const resendOtp = useCallback(async (email: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            await api.post('/api/auth/resend-otp', { email });
            return true;
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to resend code';
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (data: LoginData): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/api/auth/login', data);
            if (response.data.success) {
                const { user, tokens } = response.data.data;
                await setSession(
                    tokens as AuthTokens,
                    user as User,
                    user.status === 'PENDING_VERIFICATION' ? 'pending_verification' : 'active'
                );
                return true;
            }
            setError('Login failed');
            return false;
        } catch (err: any) {
            const message = err.response?.data?.error || 'Invalid credentials';
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [setSession]);

    const clearError = useCallback(() => setError(null), []);

    return {
        loading,
        error,
        checkUsername,
        register,
        verifyOtp,
        resendOtp,
        login,
        clearError,
    };
}
