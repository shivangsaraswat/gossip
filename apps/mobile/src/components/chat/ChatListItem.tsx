import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Icon } from '../ui';
import { colors, spacing, typography } from '../../theme';
import type { Chat } from '../../types';

interface ChatListItemProps {
    chat: Chat;
    onPress: () => void;
}

/**
 * Chat List Item Component
 * Shows avatar, name, last message preview, timestamp, and read status
 */
export function ChatListItem({ chat, onPress }: ChatListItemProps) {
    const { participant, lastMessage } = chat;
    const displayName = participant.displayName || participant.username;

    // Format timestamp (simplified)
    const formatTimestamp = (timestamp?: string) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Avatar */}
            <View style={styles.avatarContainer}>
                {participant.avatarUrl ? (
                    <Image
                        source={{ uri: participant.avatarUrl }}
                        style={styles.avatar}
                    />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                            {displayName.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.topRow}>
                    <View style={styles.nameRow}>
                        <Text style={styles.name} numberOfLines={1}>
                            {displayName}
                        </Text>
                        {participant.isVerified && (
                            <View style={styles.verifiedIcon}>
                                <Icon name="checkmark" size={10} color={colors.white} strokeWidth={3} />
                            </View>
                        )}
                    </View>
                    <Text style={styles.timestamp}>
                        {formatTimestamp(lastMessage?.timestamp)}
                    </Text>
                </View>
                <View style={styles.bottomRow}>
                    <Text style={styles.message} numberOfLines={1}>
                        {lastMessage?.content || 'No messages yet'}
                    </Text>
                    {lastMessage?.isRead && (
                        <View style={styles.readIcon}>
                            <Icon name="checkmark" size={14} color={colors.primary} />
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const AVATAR_SIZE = 52;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    avatarContainer: {
        marginRight: spacing.md,
    },
    avatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        backgroundColor: colors.surface,
    },
    avatarPlaceholder: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        backgroundColor: '#E0E7FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        ...typography.title,
        color: colors.primary,
        fontSize: 20,
    },
    content: {
        flex: 1,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: spacing.sm,
    },
    name: {
        ...typography.body,
        color: colors.text,
        fontWeight: '600',
        fontSize: 16,
        flexShrink: 1,
    },
    verifiedIcon: {
        marginLeft: 6,
        backgroundColor: colors.primary,
        borderRadius: 10,
        width: 14,
        height: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timestamp: {
        ...typography.caption,
        color: colors.textMuted,
        fontSize: 12,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    message: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        flex: 1,
        marginRight: spacing.sm,
        fontSize: 14,
    },
    readIcon: {
        marginLeft: spacing.xs,
    },
});
