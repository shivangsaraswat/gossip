import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, typography } from '../../theme';

type AvatarSize = 'sm' | 'md' | 'lg';

const SIZES: Record<AvatarSize, number> = {
    sm: 32,
    md: 40,
    lg: 56,
};

interface AvatarProps {
    /** Image source URI */
    source?: string;
    /** Fallback initials (e.g., "JD" for John Doe) */
    initials?: string;
    /** Size variant */
    size?: AvatarSize;
    /** Custom style */
    style?: any;
}

/**
 * Avatar
 * Circular avatar with image or initials fallback:
 * - Size variants: sm (32), md (40), lg (56)
 * - Uses primary color for initials background
 */
export function Avatar({
    source,
    initials,
    size = 'md',
    style,
}: AvatarProps) {
    const dimension = SIZES[size];
    const fontSize = dimension / 2.5;

    const containerStyle = {
        width: dimension,
        height: dimension,
        borderRadius: dimension / 2,
    };

    if (source) {
        return (
            <Image
                source={{ uri: source }}
                style={[styles.image, containerStyle, style]}
            />
        );
    }

    return (
        <View style={[styles.fallback, containerStyle, style]}>
            <Text style={[styles.initials, { fontSize }]}>
                {initials?.slice(0, 2).toUpperCase() || '?'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        backgroundColor: colors.surfaceSecondary,
    },
    fallback: {
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: {
        color: colors.secondaryDark,
        fontWeight: '600',
    },
});
