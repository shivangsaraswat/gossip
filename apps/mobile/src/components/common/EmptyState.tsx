import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface EmptyStateProps {
    /** Icon or emoji */
    icon?: string;
    /** Title text */
    title: string;
    /** Description text */
    description?: string;
    /** Custom style */
    style?: ViewStyle;
}

/**
 * EmptyState
 * Empty list/screen state:
 * - Icon/emoji at top
 * - Title and optional description
 * - Center aligned
 */
export function EmptyState({
    icon = '📭',
    title,
    description,
    style,
}: EmptyStateProps) {
    return (
        <View style={[styles.container, style]}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.title}>{title}</Text>
            {description && (
                <Text style={styles.description}>{description}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    icon: {
        fontSize: 48,
        marginBottom: spacing.md,
    },
    title: {
        ...typography.styles.section,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    description: {
        ...typography.styles.body,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
