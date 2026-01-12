import { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TextInput,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { UserCard, type RelationshipStatus } from '../../src/components/ui';
import { useUsers, useFollows, type SearchUser } from '../../src/hooks';
import { useAuthStore } from '../../src/store';
import { colors, spacing, borderRadius, typography } from '../../src/theme';

/**
 * Explore Members Screen
 * Core of Phase 1C - find and connect with others
 */
export default function ExploreScreen() {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);

    const { loading: searchLoading, users, searchUsers, clearUsers } = useUsers();
    const {
        actionLoading,
        pendingRequests,
        sendFollowRequest,
        acceptFollowRequest,
        fetchPendingRequests,
    } = useFollows();

    const [query, setQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [localUsers, setLocalUsers] = useState<SearchUser[]>([]);

    // Sync users with local state for optimistic updates
    useEffect(() => {
        setLocalUsers(users);
    }, [users]);

    // Fetch pending requests on mount
    useEffect(() => {
        fetchPendingRequests();
    }, [fetchPendingRequests]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim()) {
                searchUsers(query.trim());
            } else {
                clearUsers();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, searchUsers, clearUsers]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([
            query.trim() ? searchUsers(query.trim()) : Promise.resolve(),
            fetchPendingRequests(),
        ]);
        setRefreshing(false);
    }, [query, searchUsers, fetchPendingRequests]);

    const handleFollowAction = useCallback(async (
        userId: string,
        action: 'follow' | 'accept' | 'unfollow'
    ) => {
        // Optimistic update
        setLocalUsers((prev) =>
            prev.map((u) => {
                if (u.id !== userId) return u;
                let newRelationship: RelationshipStatus = u.relationship;
                if (action === 'follow') newRelationship = 'request_sent';
                if (action === 'accept') newRelationship = 'mutual';
                if (action === 'unfollow') newRelationship = 'not_following';
                return { ...u, relationship: newRelationship };
            })
        );

        let success = false;
        if (action === 'follow') {
            success = await sendFollowRequest(userId);
        } else if (action === 'accept') {
            // Find request ID for this user
            const request = pendingRequests.find((r) => r.sender.id === userId);
            if (request) {
                success = await acceptFollowRequest(request.id);
            }
        }

        // Revert on failure
        if (!success) {
            setLocalUsers(users);
        }
    }, [sendFollowRequest, acceptFollowRequest, pendingRequests, users]);

    const handleUserPress = useCallback((userId: string) => {
        router.push(`/(app)/profile/${userId}`);
    }, [router]);

    const renderUser = useCallback(({ item }: { item: SearchUser }) => {
        // Check if there's a pending request from this user
        const hasIncomingRequest = pendingRequests.some(
            (r) => r.sender.id === item.id
        );
        const relationship: RelationshipStatus = hasIncomingRequest
            ? 'request_received'
            : item.relationship;

        return (
            <UserCard
                {...item}
                relationship={relationship}
                onPress={() => handleUserPress(item.id)}
                onFollowAction={(action) => handleFollowAction(item.id, action)}
                loading={actionLoading === item.id}
            />
        );
    }, [pendingRequests, actionLoading, handleUserPress, handleFollowAction]);

    const renderEmpty = useCallback(() => {
        if (searchLoading) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Searching...</Text>
                </View>
            );
        }

        if (query.trim()) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>No users found</Text>
                    <Text style={styles.emptyText}>
                        Try a different username
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>Find People</Text>
                <Text style={styles.emptyText}>
                    Search by username to connect with others
                </Text>
            </View>
        );
    }, [searchLoading, query]);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>
                        Hello, {user && 'displayName' in user ? user.displayName : 'there'}
                    </Text>
                    <Text style={styles.title}>Explore</Text>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by username..."
                    placeholderTextColor={colors.textMuted}
                    value={query}
                    onChangeText={setQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            {/* Pending Requests Banner */}
            {pendingRequests.length > 0 && !query.trim() && (
                <View style={styles.pendingBanner}>
                    <Text style={styles.pendingText}>
                        {pendingRequests.length} pending request{pendingRequests.length > 1 ? 's' : ''}
                    </Text>
                </View>
            )}

            {/* Users List */}
            <FlatList
                data={localUsers}
                renderItem={renderUser}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                    />
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
    },
    greeting: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    title: {
        ...typography.h1,
        color: colors.text,
    },
    logoutButton: {
        padding: spacing.sm,
    },
    logoutText: {
        ...typography.bodySmall,
        color: colors.textMuted,
    },
    searchContainer: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    searchInput: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        ...typography.body,
        color: colors.text,
    },
    pendingBanner: {
        backgroundColor: colors.primary + '20',
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
        padding: spacing.md,
        borderRadius: borderRadius.md,
    },
    pendingText: {
        ...typography.bodySmall,
        color: colors.primary,
        textAlign: 'center',
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxl,
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: spacing.xxl * 2,
    },
    emptyTitle: {
        ...typography.h3,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    emptyText: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
