import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface AuthTitleProps {
    /** Main title text */
    title: string;
    /** Subtitle/description text */
    subtitle?: string;
    /** Center align (default: false for left) */
    centered?: boolean;
    /** Custom style */
    style?: ViewStyle;
}

/**
 * AuthTitle
 * Title + subtitle for auth screens:
 * - Title uses typography.title
 * - Subtitle uses typography.body, muted color
 */
export function AuthTitle({
    title,
    subtitle,
    centered = false,
    style,
}: AuthTitleProps) {
    return (
        <View style={[styles.container, centered && styles.centered, style]}>
            <Text style={[styles.title, centered && styles.centeredText]}>
                {title}
            </Text>
            {subtitle && (
                <Text style={[styles.subtitle, centered && styles.centeredText]}>
                    {subtitle}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
    },
    centered: {
        alignItems: 'center',
    },
    title: {
        ...typography.styles.title,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.styles.body,
        color: colors.textSecondary,
    },
    centeredText: {
        textAlign: 'center',
    },
});
