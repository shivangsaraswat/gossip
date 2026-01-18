import { useState, useCallback, useEffect } from 'react';
import { api } from '../lib/api';

export interface Notification {
    id: string;
    type: 'CONNECTION_REQUEST';
    referenceId: string | null;
    isRead: boolean;
    createdAt: string;
    actor: {
        id: string;
        username: string;
        displayName: string;
    };
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/notifications');
            if (response.data.success) {
                setNotifications(response.data.data.notifications);
            }
        } catch (err: any) {
            console.error('Fetch notifications error:', err);
            setError(err.response?.data?.error || 'Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsRead = useCallback(async (id: string) => {
        try {
            await api.patch(`/api/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
        } catch (err) {
            console.error('Mark as read error:', err);
        }
    }, []);

    const removeNotification = useCallback((referenceId: string) => {
        setNotifications(prev => prev.filter(n => n.referenceId !== referenceId));
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return {
        notifications,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        removeNotification
    };
}
