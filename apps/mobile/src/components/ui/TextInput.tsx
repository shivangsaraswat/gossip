import React, { useState } from 'react';
import {
    View,
    TextInput as RNTextInput,
    Text,
    StyleSheet,
    ViewStyle,
    TextInputProps as RNTextInputProps,
} from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';

interface TextInputProps extends RNTextInputProps {
    /** Label above the input */
    label?: string;
    /** Error message below the input */
    error?: string;
    /** Hint text below the input */
    hint?: string;
    /** Container style */
    containerStyle?: ViewStyle;
}

/**
 * TextInput
 * Styled text input per spec:
 * - Border radius: 12
 * - Soft border: border color
 * - Focus border: primary color
 * - Error state supported
 */
export function TextInput({
    label,
    error,
    hint,
    containerStyle,
    ...props
}: TextInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const getBorderColor = () => {
        if (error) return colors.error;
        if (isFocused) return colors.primary;
        return colors.border;
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <RNTextInput
                {...props}
                style={[
                    styles.input,
                    { borderColor: getBorderColor() },
                    props.style,
                ]}
                placeholderTextColor={colors.textMuted}
                onFocus={(e) => {
                    setIsFocused(true);
                    props.onFocus?.(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    props.onBlur?.(e);
                }}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            {hint && !error && <Text style={styles.hint}>{hint}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    label: {
        fontSize: typography.meta,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
        fontWeight: '500',
    },
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderRadius: radius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        fontSize: typography.body,
        color: colors.textPrimary,
    },
    error: {
        fontSize: typography.meta,
        color: colors.error,
        marginTop: spacing.xs,
    },
    hint: {
        fontSize: typography.meta,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
});
