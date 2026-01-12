import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme';

interface DividerProps {
    /** Custom style */
    style?: ViewStyle;
    /** Add vertical margin */
    spacing?: 'sm' | 'md' | 'lg';
}

/**
 * Divider
 * Horizontal line separator:
 * - Uses border color from theme
 * - Optional vertical spacing
 */
export function Divider({ style, spacing: spacingSize }: DividerProps) {
    const marginVertical = spacingSize
        ? spacing[spacingSize]
        : 0;

    return (
        <View
            style={[
                styles.divider,
                { marginVertical },
                style,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
    },
});
