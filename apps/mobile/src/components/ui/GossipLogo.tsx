import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface GossipLogoProps {
    size?: number;
}

/**
 * Gossip Logo Component
 * Uses the logo-gossip.png asset
 */
export function GossipLogo({ size = 80 }: GossipLogoProps) {
    return (
        <Image
            source={require('../../../assets/logo-gossip.png')}
            style={[
                styles.logo,
                {
                    width: size,
                    height: size * 0.6, // Maintain aspect ratio
                }
            ]}
            resizeMode="contain"
        />
    );
}

const styles = StyleSheet.create({
    logo: {
        // Default styles
    },
});
