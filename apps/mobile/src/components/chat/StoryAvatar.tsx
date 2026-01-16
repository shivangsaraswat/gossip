import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Icon } from '../ui';
import { colors, spacing, typography } from '../../theme';

interface StoryAvatarProps {
    avatarUrl?: string;
    displayName?: string;
    username: string;
    isVerified?: boolean;
    hasUnseenStory?: boolean;
    isAddButton?: boolean;
}

/**
 * Story Avatar Component
 * Circular avatar with optional blue ring border and name
 */
export function StoryAvatar({
    avatarUrl,
    displayName,
    username,
    isVerified,
    hasUnseenStory,
    isAddButton,
}: StoryAvatarProps) {
    const name = displayName || username;

    if (isAddButton) {
        return (
            <View style={styles.container}>
                <View style={styles.addAvatarContainer}>
                    <View style={styles.addAvatar}>
                        <Icon name="add" size={24} color={colors.textMuted} />
                    </View>
                </View>
                <Text style={styles.name} numberOfLines={1}>
                    Add Story
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.avatarContainer,
                    hasUnseenStory && styles.avatarContainerUnseen,
                ]}
            >
                {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                            {name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
            </View>
            <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>
                {isVerified && (
                    <View style={styles.verifiedIcon}>
                        <Icon name="checkmark" size={8} color={colors.white} strokeWidth={3} />
                    </View>
                )}
            </View>
        </View>
    );
}

const AVATAR_SIZE = 60;
const BORDER_WIDTH = 2;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: 72,
    },
    avatarContainer: {
        width: AVATAR_SIZE + BORDER_WIDTH * 2,
        height: AVATAR_SIZE + BORDER_WIDTH * 2,
        borderRadius: (AVATAR_SIZE + BORDER_WIDTH * 2) / 2,
        padding: BORDER_WIDTH,
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    avatarContainerUnseen: {
        borderColor: colors.primary,
        padding: 2,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: AVATAR_SIZE,
        backgroundColor: colors.surface,
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: AVATAR_SIZE,
        backgroundColor: '#E0E7FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        ...typography.title,
        color: colors.primary,
        fontSize: 22,
    },
    addAvatarContainer: {
        width: AVATAR_SIZE + BORDER_WIDTH * 2,
        height: AVATAR_SIZE + BORDER_WIDTH * 2,
        borderRadius: (AVATAR_SIZE + BORDER_WIDTH * 2) / 2,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addAvatar: {
        width: AVATAR_SIZE - 4,
        height: AVATAR_SIZE - 4,
        borderRadius: AVATAR_SIZE,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
        justifyContent: 'center',
    },
    name: {
        ...typography.caption,
        color: colors.text,
        textAlign: 'center',
        maxWidth: 60,
        fontSize: 12,
    },
    verifiedIcon: {
        marginLeft: 2,
        backgroundColor: colors.primary,
        borderRadius: 8,
        width: 12,
        height: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
