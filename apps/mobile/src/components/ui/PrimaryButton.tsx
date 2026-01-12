import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
} from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
}

/**
 * PrimaryButton
 * Main CTA button with primary color background:
 * - Full width by default
 * - White text
 * - Border radius: lg (16)
 */
export function PrimaryButton({
    title,
    onPress,
    disabled = false,
    loading = false,
    style,
}: PrimaryButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            style={[styles.button, isDisabled && styles.disabled, style]}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={colors.white} size="small" />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.lg,
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
        color: colors.white,
    },
});
