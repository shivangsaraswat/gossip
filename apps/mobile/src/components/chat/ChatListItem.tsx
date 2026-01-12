import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, radius } from '../../theme';
import { Avatar } from '../ui/Avatar';

interface ChatListItemProps {
    avatarUrl?: string;
    name: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    onPress: () => void;
}

export function ChatListItem({
    avatarUrl,
    name,
    lastMessage,
    time,
    unreadCount,
    onPress,
}: ChatListItemProps) {
    const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <Avatar source={avatarUrl} initials={initials} size="lg" />
            <View style={styles.content}>
                <View style={styles.topRow}>
                    <Text style={styles.name} numberOfLines={1}>{name}</Text>
                    <Text style={[styles.time, unreadCount ? styles.timeUnread : null]}>{time}</Text>
                </View>
                <View style={styles.bottomRow}>
                    <Text style={styles.message} numberOfLines={1}>{lastMessage}</Text>
                    {unreadCount && unreadCount > 0 ? (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.surface,
    },
    content: {
        flex: 1,
        marginLeft: spacing.md,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: typography.body,
        fontWeight: '500',
        color: colors.textPrimary,
        flex: 1,
        marginRight: spacing.sm,
    },
    time: {
        fontSize: typography.meta,
        color: colors.textMuted,
    },
    timeUnread: {
        color: colors.primary,
    },
    message: {
        fontSize: typography.body,
        color: colors.textSecondary,
        flex: 1,
        marginRight: spacing.sm,
    },
    badge: {
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xs,
    },
    badgeText: {
        fontSize: typography.meta,
        color: colors.white,
        fontWeight: '600',
    },
});
