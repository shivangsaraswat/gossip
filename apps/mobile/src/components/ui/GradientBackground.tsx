import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface GradientBackgroundProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

/**
 * Screen Container Component
 * Plain white background without gradient
 * Renamed to preserve import consistency but functionality is changed
 */
export function GradientBackground({ children, style }: GradientBackgroundProps) {
    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
});
