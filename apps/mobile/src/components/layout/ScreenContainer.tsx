import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';

interface ScreenContainerProps {
    children: ReactNode;
    /** Apply horizontal padding (default: true) */
    padded?: boolean;
    /** Custom styles for the inner container */
    style?: ViewStyle;
    /** Safe area edges to respect (default: all) */
    edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

/**
 * ScreenContainer
 * Wraps every screen with consistent styling:
 * - Background color from theme
 * - Safe area handling
 * - Optional horizontal padding
 * 
 * No screen should use SafeAreaView directly.
 */
export function ScreenContainer({
    children,
    padded = true,
    style,
    edges = ['top', 'bottom', 'left', 'right'],
}: ScreenContainerProps) {
    return (
        <SafeAreaView style={styles.safeArea} edges={edges}>
            <View style={[styles.container, padded && styles.padded, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    padded: {
        paddingHorizontal: spacing.md,
    },
});
