import { useState, useCallback, useEffect } from 'react';
import { api } from '../lib/api';

export interface UserProfile {
    id: string;
    username: string;
    displayName: string;
    bio?: string;
    avatarUrl?: string | null;
}

export function useProfile(userId: string) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/users/${userId}`);
            if (response.data.success) {
                setUser(response.data.data.user);
            }
        } catch (err: any) {
            console.error('Fetch profile error:', err);
            setError(err.response?.data?.error || 'Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        user,
        loading,
        error,
        refetch: fetchProfile,
    };
}
