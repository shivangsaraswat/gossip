import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '../ui';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface SectionHeaderProps {
    title: string;
    count?: number;
    onMenuPress?: () => void;
}

/**
 * Section Header Component
 * Title with count badge and 3-dot menu
 */
export function SectionHeader({
    title,
    count,
    onMenuPress,
}: SectionHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.titleRow}>
                <Text style={styles.title}>{title}</Text>
                {count !== undefined && count > 0 && (
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{count}</Text>
                    </View>
                )}
            </View>
            <TouchableOpacity
                style={styles.menuButton}
                onPress={onMenuPress}
                activeOpacity={0.7}
            >
                <Icon name="menu" size={20} color={colors.textMuted} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        marginTop: spacing.xs,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        ...typography.h3,
        fontSize: 18,
        color: colors.text,
        fontWeight: '700',
    },
    countBadge: {
        marginLeft: spacing.sm,
        backgroundColor: '#E5E7EB',
        borderRadius: borderRadius.full,
        paddingHorizontal: 8,
        paddingVertical: 2,
        minWidth: 24,
        alignItems: 'center',
    },
    countText: {
        ...typography.caption,
        color: colors.text,
        fontWeight: '600',
        fontSize: 12,
    },
    menuButton: {
        padding: spacing.xs,
    },
});
