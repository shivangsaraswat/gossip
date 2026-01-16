import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    ViewStyle,
    TextInputProps,
    TouchableOpacity,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    hint?: string;
    success?: boolean;
    containerStyle?: ViewStyle;
    showPasswordToggle?: boolean;
}

/**
 * Input Component
 * Light theme with rounded corners and subtle borders
 * Matches Figma design specifications
 */
export function Input({
    label,
    error,
    hint,
    success,
    containerStyle,
    showPasswordToggle,
    secureTextEntry,
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const getBorderColor = () => {
        if (error) return colors.error;
        if (success) return colors.success;
        if (isFocused) return colors.primary;
        return colors.border;
    };

    const shouldShowPassword = secureTextEntry && showPasswordToggle;
    const actualSecureEntry = secureTextEntry && !isPasswordVisible;

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputWrapper, { borderColor: getBorderColor() }]}>
                <TextInput
                    {...props}
                    style={[styles.input, props.style]}
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={actualSecureEntry}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                />
                {shouldShowPassword && (
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={styles.eyeIcon}>
                            {isPasswordVisible ? '👁' : '👁‍🗨'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
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
        ...typography.bodySmall,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderRadius: borderRadius.sm,
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        ...typography.body,
        color: colors.text,
    },
    eyeButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    eyeIcon: {
        fontSize: 18,
    },
    error: {
        ...typography.caption,
        color: colors.error,
        marginTop: spacing.xs,
    },
    hint: {
        ...typography.caption,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
});
