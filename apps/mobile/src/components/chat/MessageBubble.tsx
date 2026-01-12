import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography, radius } from '../../theme';

interface MessageBubbleProps {
    /** Message content */
    message: string;
    /** Timestamp string */
    time: string;
    /** Whether this is an outgoing message */
    isOutgoing?: boolean;
    /** Custom style */
    style?: ViewStyle;
}

/**
 * MessageBubble
 * Chat message bubble:
 * - Incoming: white background
 * - Outgoing: primarySoft background
 * - Border radius: 16
 * - Max width: 75%
 */
export function MessageBubble({
    message,
    time,
    isOutgoing = false,
    style,
}: MessageBubbleProps) {
    return (
        <View
            style={[
                styles.container,
                isOutgoing ? styles.outgoing : styles.incoming,
                style,
            ]}
        >
            <View
                style={[
                    styles.bubble,
                    isOutgoing ? styles.bubbleOutgoing : styles.bubbleIncoming,
                ]}
            >
                <Text style={styles.message}>{message}</Text>
                <Text style={styles.time}>{time}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        maxWidth: '75%',
    },
    incoming: {
        alignSelf: 'flex-start',
    },
    outgoing: {
        alignSelf: 'flex-end',
    },
    bubble: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radius.lg,
    },
    bubbleIncoming: {
        backgroundColor: colors.surface,
        borderBottomLeftRadius: spacing.xs,
    },
    bubbleOutgoing: {
        backgroundColor: colors.primarySoft,
        borderBottomRightRadius: spacing.xs,
    },
    message: {
        ...typography.styles.body,
        color: colors.textPrimary,
    },
    time: {
        fontSize: typography.meta,
        color: colors.textMuted,
        alignSelf: 'flex-end',
        marginTop: spacing.xs,
    },
});
