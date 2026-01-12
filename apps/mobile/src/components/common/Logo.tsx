import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography, radius } from '../../theme';

type LogoSize = 'large' | 'medium' | 'small';

const SIZES: Record<LogoSize, number> = {
    large: 80,
    medium: 56,
    small: 40,
};

interface LogoProps {
    /** Size variant */
    size?: LogoSize;
    /** Show app name below logo */
    showName?: boolean;
    /** Custom style */
    style?: ViewStyle;
}

/**
 * Logo
 * App logo with size variants:
 * - Large: splash screen
 * - Medium: auth screens
 * - Small: headers
 */
export function Logo({
    size = 'medium',
    showName = false,
    style,
}: LogoProps) {
    const dimension = SIZES[size];
    const fontSize = dimension / 2;
    const borderRad = dimension / 4;

    return (
        <View style={[styles.container, style]}>
            <View
                style={[
                    styles.logo,
                    {
                        width: dimension,
                        height: dimension,
                        borderRadius: borderRad,
                    },
                ]}
            >
                <Text style={[styles.letter, { fontSize }]}>G</Text>
            </View>
            {showName && <Text style={styles.name}>Gossip</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    logo: {
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    letter: {
        color: colors.white,
        fontWeight: '700',
    },
    name: {
        ...typography.styles.title,
        color: colors.textPrimary,
        marginTop: spacing.md,
    },
});
