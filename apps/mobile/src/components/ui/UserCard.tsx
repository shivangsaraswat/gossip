import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Avatar } from './Avatar';
import { colors, spacing, radius, typography } from '../../theme';

type RelationshipStatus = 'not_following' | 'request_sent' | 'request_received' | 'following' | 'mutual';

interface UserCardProps {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    relationship: RelationshipStatus;
    onPress?: () => void;
    onFollowAction?: (action: 'follow' | 'accept' | 'unfollow' | 'cancel') => void;
    loading?: boolean;
}

/**
 * UserCard Component
 * Displays user info with follow/accept action button
 */
export function UserCard({
    username,
    displayName,
    avatarUrl,
    relationship,
    onPress,
    onFollowAction,
    loading,
}: UserCardProps) {
    const initials = (displayName || username)
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const getButtonConfig = () => {
        switch (relationship) {
            case 'not_following':
                return { label: 'Follow', action: 'follow' as const, variant: 'primary' };
            case 'request_sent':
                return { label: 'Requested', action: 'cancel' as const, variant: 'secondary' };
            case 'request_received':
                return { label: 'Accept', action: 'accept' as const, variant: 'primary' };
            case 'following':
            case 'mutual':
                return { label: 'Following', action: 'unfollow' as const, variant: 'secondary' };
            default:
                return { label: 'Follow', action: 'follow' as const, variant: 'primary' };
        }
    };

    const buttonConfig = getButtonConfig();

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <Avatar source={avatarUrl} initials={initials} size="md" />

            <View style={styles.info}>
                <Text style={styles.displayName} numberOfLines={1}>
                    {displayName || username}
                </Text>
                <Text style={styles.username} numberOfLines={1}>
                    @{username}
                </Text>
            </View>

            <TouchableOpacity
                style={[
                    styles.actionButton,
                    buttonConfig.variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
                ]}
                onPress={() => onFollowAction?.(buttonConfig.action)}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color={buttonConfig.variant === 'primary' ? colors.white : colors.primary} />
                ) : (
                    <Text style={[
                        styles.actionText,
                        buttonConfig.variant === 'primary' ? styles.primaryText : styles.secondaryText,
                    ]}>
                        {buttonConfig.label}
                    </Text>
                )}
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

export type { RelationshipStatus };

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    info: {
        flex: 1,
        marginLeft: spacing.md,
    },
    displayName: {
        fontSize: typography.body,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    username: {
        fontSize: typography.meta,
        color: colors.textSecondary,
        marginTop: 2,
    },
    actionButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.full,
        minWidth: 90,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: colors.primary,
    },
    secondaryButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    actionText: {
        fontSize: typography.meta,
        fontWeight: '600',
    },
    primaryText: {
        color: colors.white,
    },
    secondaryText: {
        color: colors.primary,
    },
});
