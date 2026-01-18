import { useState, useCallback, useEffect } from 'react';
import { api } from '../lib/api';

export interface Connection {
    id: string;
    username: string;
    displayName: string;
}

export function useConnections() {
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchConnections = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/follows/connected');
            if (response.data.success) {
                setConnections(response.data.data.connections);
            }
        } catch (err: any) {
            console.error('Fetch connections error:', err);
            setError(err.response?.data?.error || 'Failed to fetch connections');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConnections();
    }, [fetchConnections]);

    return {
        connections,
        loading,
        error,
        refetch: fetchConnections,
    };
}
