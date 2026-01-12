import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
} from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';

interface SecondaryButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
}

/**
 * SecondaryButton
 * Outline style button for secondary actions:
 * - Transparent background with border
 * - Text in primary color
 * - Border radius: lg (16)
 */
export function SecondaryButton({
    title,
    onPress,
    disabled = false,
    loading = false,
    style,
}: SecondaryButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            style={[styles.button, isDisabled && styles.disabled, style]}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={colors.primary} size="small" />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.transparent,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: typography.body,
        fontWeight: '600',
        color: colors.textPrimary,
    },
});
