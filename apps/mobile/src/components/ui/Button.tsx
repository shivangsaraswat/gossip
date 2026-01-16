import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    View,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'google';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    icon?: React.ReactNode;
}

/**
 * Button Component
 * Matches the Figma design with primary blue and white variants
 */
export function Button({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style,
    icon,
}: ButtonProps) {
    const isDisabled = disabled || loading;

    const getBackgroundColor = () => {
        switch (variant) {
            case 'primary':
                return colors.primary;
            case 'secondary':
                return colors.surfaceLight;
            case 'outline':
            case 'google':
                return colors.white;
            default:
                return colors.primary;
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'primary':
                return colors.white;
            case 'secondary':
            case 'outline':
            case 'google':
                return colors.text;
            default:
                return colors.white;
        }
    };

    const getBorderStyle = () => {
        if (variant === 'outline' || variant === 'google') {
            return {
                borderWidth: 1,
                borderColor: colors.border,
            };
        }
        return {};
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            style={[
                styles.base,
                { backgroundColor: getBackgroundColor() },
                getBorderStyle(),
                isDisabled && styles.disabled,
                style,
            ]}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? colors.white : colors.primary}
                    size="small"
                />
            ) : (
                <View style={styles.content}>
                    {icon && <View style={styles.icon}>{icon}</View>}
                    <Text style={[styles.text, { color: getTextColor() }]}>
                        {title}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
    },
    disabled: {
        opacity: 0.5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: spacing.sm,
    },
    text: {
        ...typography.button,
    },
});
