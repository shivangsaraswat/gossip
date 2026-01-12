import { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../../../src/components/ui';
import type { RelationshipStatus } from '../../../src/components/ui/UserCard';
import { useFollows } from '../../../src/hooks';
import { api } from '../../../src/lib/api';
import { colors, spacing, borderRadius, typography } from '../../../src/theme';

interface UserProfile {
    id: string;
    username: string;
    displayName: string;
    relationship: RelationshipStatus;
}

/**
 * Profile Preview Screen
 * Read-only profile view with follow action
 */
export default function ProfileScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { actionLoading, sendFollowRequest, unfollow } = useFollows();

    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/users/${id}`);
                if (response.data.success) {
                    setUser(response.data.data.user);
                }
            } catch (err: any) {
                setError(err.response?.data?.error || 'User not found');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleFollowAction = useCallback(async () => {
        if (!user) return;

        const currentRelationship = user.relationship;

        // Optimistic update
        let newRelationship: RelationshipStatus;
        if (currentRelationship === 'not_following') {
            newRelationship = 'request_sent';
        } else if (currentRelationship === 'following' || currentRelationship === 'mutual') {
            newRelationship = 'not_following';
        } else {
            return;
        }

        setUser({ ...user, relationship: newRelationship });

        let success = false;
        if (currentRelationship === 'not_following') {
            success = await sendFollowRequest(user.id);
        } else {
            success = await unfollow(user.id);
        }

        if (!success) {
            setUser({ ...user, relationship: currentRelationship });
        }
    }, [user, sendFollowRequest, unfollow]);

    const getActionButton = () => {
        if (!user) return null;

        switch (user.relationship) {
            case 'not_following':
                return (
                    <Button
                        title="Follow"
                        onPress={handleFollowAction}
                        loading={actionLoading === user.id}
                    />
                );
            case 'request_sent':
                return (
                    <Button
                        title="Requested"
                        variant="secondary"
                        onPress={() => { }}
                        disabled
                    />
                );
            case 'following':
                return (
                    <Button
                        title="Following"
                        variant="outline"
                        onPress={handleFollowAction}
                        loading={actionLoading === user.id}
                    />
                );
            case 'mutual':
                return (
                    <Button
                        title="Mutual"
                        variant="secondary"
                        onPress={() => { }}
                        disabled
                    />
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error || 'User not found'}</Text>
                    <Button
                        title="Go Back"
                        variant="outline"
                        onPress={() => router.back()}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
            </View>

            {/* Profile */}
            <View style={styles.profileContainer}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user.displayName.charAt(0).toUpperCase()}
                    </Text>
                </View>

                <Text style={styles.displayName}>{user.displayName}</Text>
                <Text style={styles.username}>@{user.username}</Text>

                {user.relationship === 'mutual' && (
                    <View style={styles.mutualBadge}>
                        <Text style={styles.mutualText}>✓ Mutual connection</Text>
                    </View>
                )}
            </View>

            {/* Action */}
            <View style={styles.actionContainer}>
                {getActionButton()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    backButton: {
        ...typography.body,
        color: colors.primary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...typography.body,
        color: colors.textSecondary,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        gap: spacing.lg,
    },
    errorText: {
        ...typography.body,
        color: colors.error,
        textAlign: 'center',
    },
    profileContainer: {
        alignItems: 'center',
        paddingVertical: spacing.xxl,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    avatarText: {
        ...typography.h1,
        fontSize: 48,
        color: colors.textSecondary,
    },
    displayName: {
        ...typography.h2,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    username: {
        ...typography.body,
        color: colors.textSecondary,
    },
    mutualBadge: {
        marginTop: spacing.lg,
        backgroundColor: colors.primaryDark + '30',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.full,
    },
    mutualText: {
        ...typography.bodySmall,
        color: colors.primary,
    },
    actionContainer: {
        paddingHorizontal: spacing.xl,
        marginTop: 'auto',
        paddingBottom: spacing.xxl,
    },
});
