import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import type { RelationshipStatus } from '../components/ui/UserCard';

export interface SearchUser {
    id: string;
    username: string;
    displayName: string;
    relationship: RelationshipStatus;
}

export function useUsers() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<SearchUser[]>([]);

    const searchUsers = useCallback(async (query: string): Promise<void> => {
        if (!query || query.length < 1) {
            setUsers([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.get('/api/users/search', {
                params: { query },
            });
            if (response.data.success) {
                setUsers(response.data.data.users);
            }
        } catch (err: any) {
            const message = err.response?.data?.error || 'Search failed';
            setError(message);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearUsers = useCallback(() => {
        setUsers([]);
        setError(null);
    }, []);

    return {
        loading,
        error,
        users,
        searchUsers,
        clearUsers,
    };
}
