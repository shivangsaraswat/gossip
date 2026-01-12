import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface AuthFooterProps {
    /** Question text (e.g., "Already have an account?") */
    question: string;
    /** Link text (e.g., "Log in") */
    linkText: string;
    /** Callback when link is pressed */
    onLinkPress: () => void;
}

/**
 * AuthFooter
 * Links below auth forms:
 * - Muted question text
 * - Primary colored link
 */
export function AuthFooter({
    question,
    linkText,
    onLinkPress,
}: AuthFooterProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.question}>{question} </Text>
            <TouchableOpacity onPress={onLinkPress} hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}>
                <Text style={styles.link}>{linkText}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    question: {
        fontSize: typography.body,
        color: colors.textSecondary,
    },
    link: {
        fontSize: typography.body,
        color: colors.primary,
        fontWeight: '600',
    },
});
