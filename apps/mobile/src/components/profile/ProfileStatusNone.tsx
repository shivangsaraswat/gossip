import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Icon } from '../ui';

interface ProfileStatusNoneProps {
    onConnect: () => void;
    onMessage?: () => void;
    loading?: boolean;
}

export function ProfileStatusNone({
    onConnect,
    onMessage,
    loading
}: ProfileStatusNoneProps) {
    return (
        <View style={styles.container}>
            <View style={styles.buttonRow}>
                {/* Connect Button - Primary Gradient */}
                <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={onConnect}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#49AAFF', '#188BEF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.button}
                    >
                        <Text style={styles.primaryButtonText}>
                            {loading ? 'Connecting...' : 'Connect'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Message Button - Disabled Outline */}
                <TouchableOpacity
                    style={[styles.button, styles.outlineButton, styles.disabledButton]}
                    onPress={onMessage}
                    disabled={true} // Explicitly disabled as per spec
                    activeOpacity={0.8}
                >
                    <Text style={[styles.outlineButtonText, styles.disabledText]}>
                        Message
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: spacing.md,
        width: '100%',
    },
    buttonWrapper: {
        flex: 1,
    },
    button: {
        height: 44,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    // primaryButton style removed as it's handled by gradient
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    primaryButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    outlineButtonText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '500',
    },
    disabledButton: {
        opacity: 0.5,
        backgroundColor: 'transparent',
        borderColor: '#E5E7EB',
    },
    disabledText: {
        color: '#9CA3AF',
    },
});
