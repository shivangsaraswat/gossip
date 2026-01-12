import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';

export type RelationshipStatus =
    | 'not_following'
    | 'request_sent'
    | 'request_received'
    | 'following'
    | 'mutual';

interface UserCardProps {
    id: string;
    username: string;
    displayName: string;
    relationship: RelationshipStatus;
    onPress?: () => void;
    onFollowAction?: (action: 'follow' | 'accept' | 'unfollow') => void;
    loading?: boolean;
}

export function UserCard({
    username,
    displayName,
    relationship,
    onPress,
    onFollowAction,
    loading,
}: UserCardProps) {
    const getActionButton = () => {
        if (loading) {
            return (
                <View style={[styles.actionButton, styles.loadingButton]}>
                    <Text style={styles.actionText}>...</Text>
                </View>
            );
        }

        switch (relationship) {
            case 'not_following':
                return (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.followButton]}
                        onPress={() => onFollowAction?.('follow')}
                    >
                        <Text style={styles.actionText}>Follow</Text>
                    </TouchableOpacity>
                );
            case 'request_sent':
                return (
                    <View style={[styles.actionButton, styles.requestedButton]}>
                        <Text style={styles.requestedText}>Requested</Text>
                    </View>
                );
            case 'request_received':
                return (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.acceptButton]}
                        onPress={() => onFollowAction?.('accept')}
                    >
                        <Text style={styles.actionText}>Accept</Text>
                    </TouchableOpacity>
                );
            case 'following':
                return (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.followingButton]}
                        onPress={() => onFollowAction?.('unfollow')}
                    >
                        <Text style={styles.followingText}>Following</Text>
                    </TouchableOpacity>
                );
            case 'mutual':
                return (
                    <View style={[styles.actionButton, styles.mutualButton]}>
                        <Text style={styles.mutualText}>Mutual</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    {displayName.charAt(0).toUpperCase()}
                </Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.displayName} numberOfLines={1}>
                    {displayName}
                </Text>
                <Text style={styles.username} numberOfLines={1}>
                    @{username}
                </Text>
            </View>
            {getActionButton()}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.sm,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    avatarText: {
        ...typography.h3,
        color: colors.textSecondary,
    },
    info: {
        flex: 1,
    },
    displayName: {
        ...typography.body,
        fontWeight: '600',
        color: colors.text,
    },
    username: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    actionButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        minWidth: 80,
        alignItems: 'center',
    },
    followButton: {
        backgroundColor: colors.primary,
    },
    requestedButton: {
        backgroundColor: colors.surfaceLight,
        borderWidth: 1,
        borderColor: colors.border,
    },
    acceptButton: {
        backgroundColor: colors.success,
    },
    followingButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
    },
    mutualButton: {
        backgroundColor: colors.primaryDark,
    },
    loadingButton: {
        backgroundColor: colors.surfaceLight,
    },
    actionText: {
        ...typography.bodySmall,
        fontWeight: '600',
        color: colors.text,
    },
    requestedText: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    followingText: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    mutualText: {
        ...typography.bodySmall,
        fontWeight: '600',
        color: colors.text,
    },
});
