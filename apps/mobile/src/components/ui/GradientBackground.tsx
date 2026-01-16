import React from 'react';
import { StyleSheet, View, ViewStyle, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GradientBackgroundProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

/**
 * Gradient Background Component
 * Smooth light blue at top fading to pure white at bottom
 * Uses multiple thin layers for smooth blending
 */
export function GradientBackground({ children, style }: GradientBackgroundProps) {
    // Create smooth gradient using many thin overlapping strips
    const gradientSteps = 20;
    const gradientLayers = [];

    for (let i = 0; i < gradientSteps; i++) {
        const progress = i / gradientSteps;
        // Opacity decreases exponentially for smoother fade
        const opacity = Math.pow(1 - progress, 2) * 0.6;
        const top = progress * 50; // Gradient covers top 50% of screen
        const height = 50 / gradientSteps + 10; // Overlapping strips

        gradientLayers.push(
            <View
                key={i}
                style={{
                    position: 'absolute',
                    top: `${top}%`,
                    left: 0,
                    right: 0,
                    height: `${height}%`,
                    backgroundColor: '#D2E8FC',
                    opacity: opacity,
                }}
            />
        );
    }

    return (
        <View style={[styles.container, style]}>
            {/* Base white background */}
            <View style={styles.whiteBase} />
            {/* Gradient layers */}
            {gradientLayers}
            {/* Content */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    whiteBase: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
    },
});
