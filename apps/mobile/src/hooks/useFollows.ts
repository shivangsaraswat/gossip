import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import type { RelationshipStatus } from '../components/ui/UserCard';

interface PendingRequest {
    id: string;
    sender: {
        id: string;
        username: string;
        displayName: string;
    };
    createdAt: string;
}

export function useFollows() {
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);

    const sendFollowRequest = useCallback(async (userId: string): Promise<boolean> => {
        setActionLoading(userId);
        setError(null);

        try {
            const response = await api.post('/api/follows/request', { userId });
            return response.data.success;
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to send request';
            setError(message);
            return false;
        } finally {
            setActionLoading(null);
        }
    }, []);

    const acceptFollowRequest = useCallback(async (requestId: string): Promise<boolean> => {
        setActionLoading(requestId);
        setError(null);

        try {
            const response = await api.post('/api/follows/accept', { requestId });
            if (response.data.success) {
                setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
            }
            return response.data.success;
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to accept';
            setError(message);
            return false;
        } finally {
            setActionLoading(null);
        }
    }, []);

    const rejectFollowRequest = useCallback(async (requestId: string): Promise<boolean> => {
        setActionLoading(requestId);
        setError(null);

        try {
            const response = await api.post('/api/follows/reject', { requestId });
            if (response.data.success) {
                setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
            }
            return response.data.success;
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to reject';
            setError(message);
            return false;
        } finally {
            setActionLoading(null);
        }
    }, []);

    const unfollow = useCallback(async (userId: string): Promise<boolean> => {
        setActionLoading(userId);
        setError(null);

        try {
            const response = await api.post('/api/follows/unfollow', { userId });
            return response.data.success;
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to unfollow';
            setError(message);
            return false;
        } finally {
            setActionLoading(null);
        }
    }, []);

    const getRelationshipStatus = useCallback(async (userId: string): Promise<RelationshipStatus | null> => {
        try {
            const response = await api.get(`/api/follows/status/${userId}`);
            if (response.data.success) {
                return response.data.data.relationship;
            }
            return null;
        } catch {
            return null;
        }
    }, []);

    const fetchPendingRequests = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get('/api/follows/requests');
            if (response.data.success) {
                setPendingRequests(response.data.data.requests);
            }
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to fetch requests';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        actionLoading,
        error,
        pendingRequests,
        sendFollowRequest,
        acceptFollowRequest,
        rejectFollowRequest,
        unfollow,
        getRelationshipStatus,
        fetchPendingRequests,
    };
}
