import { useState, useCallback, useEffect } from 'react';
import { api } from '../lib/api';
import type { SearchUser } from './useUsers';

export interface RecentSearch {
    id: string;
    searchedUser: {
        id: string;
        username: string;
        displayName: string;
    };
    createdAt: string;
}

export function useRecentSearches() {
    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecentSearches = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/recent-searches');
            if (response.data.success) {
                setRecentSearches(response.data.data.recentSearches);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch recent searches');
            console.error('Fetch recent searches error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const addRecentSearch = useCallback(async (searchedUserId: string) => {
        try {
            await api.post('/api/recent-searches', { searchedUserId });
            // Refresh list to ensure correct order/state
            await fetchRecentSearches();
        } catch (err: any) {
            console.error('Add recent search error:', err);
        }
    }, [fetchRecentSearches]);

    const removeRecentSearch = useCallback(async (searchedUserId: string) => {
        // Optimistic update
        const previousSearches = [...recentSearches];
        setRecentSearches((prev) =>
            prev.filter(item => item.searchedUser.id !== searchedUserId)
        );

        try {
            await api.delete(`/api/recent-searches/${searchedUserId}`);
        } catch (err: any) {
            console.error('Remove recent search error:', err);
            // Revert on error
            setRecentSearches(previousSearches);
        }
    }, [recentSearches]);

    // Initial fetch
    useEffect(() => {
        fetchRecentSearches();
    }, [fetchRecentSearches]);

    return {
        recentSearches,
        loading,
        error,
        fetchRecentSearches,
        addRecentSearch,
        removeRecentSearch,
    };
}
