import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface ProfileStatusRequestedProps {
    onCancel?: () => void; // Optional if we allow cancel, spec says "User cannot resend" / "No action" on button
}

export function ProfileStatusRequested({ }: ProfileStatusRequestedProps) {
    return (
        <View style={styles.container}>
            <View style={styles.buttonRow}>
                {/* Requested Button - Disabled Muted */}
                <View style={[styles.button, styles.requestedButton]}>
                    <Text style={styles.requestedButtonText}>Requested</Text>
                </View>

                {/* Message Button - Disabled Outline */}
                <View style={[styles.button, styles.outlineButton, styles.disabledButton]}>
                    <Text style={[styles.outlineButtonText, styles.disabledText]}>
                        Message
                    </Text>
                </View>
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
    button: {
        flex: 1,
        height: 44,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    requestedButton: {
        backgroundColor: '#3B82F6', // Blue base
        opacity: 0.7, // Muted look
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    requestedButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    outlineButtonText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '500',
    },
    disabledButton: { // Style for the message button being disabled
        opacity: 0.5,
        borderColor: '#E5E7EB',
    },
    disabledText: {
        color: '#9CA3AF',
    },
});
