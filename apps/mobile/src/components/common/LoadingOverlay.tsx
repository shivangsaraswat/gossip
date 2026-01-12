import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../theme';

interface LoadingOverlayProps {
    /** Whether to show the overlay */
    visible?: boolean;
}

/**
 * LoadingOverlay
 * Full screen loading overlay:
 * - Semi-transparent background
 * - Centered activity indicator
 */
export function LoadingOverlay({ visible = true }: LoadingOverlayProps) {
    if (!visible) return null;

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
});
