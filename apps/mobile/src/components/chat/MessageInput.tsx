import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';

interface MessageInputProps {
    /** Callback when message is sent */
    onSend: (message: string) => void;
    /** Placeholder text */
    placeholder?: string;
}

/**
 * MessageInput
 * Bottom input bar for chat:
 * - Text input field
 * - Send button on right
 */
export function MessageInput({
    onSend,
    placeholder = 'Type a message...',
}: MessageInputProps) {
    const [text, setText] = useState('');

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed) return;
        onSend(trimmed);
        setText('');
    };

    const canSend = text.trim().length > 0;

    return (
        <View style={styles.container}>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    multiline
                    maxLength={1000}
                />
            </View>
            <TouchableOpacity
                style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
                onPress={handleSend}
                disabled={!canSend}
                activeOpacity={0.7}
            >
                <Text style={styles.sendIcon}>➤</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: spacing.sm,
        backgroundColor: colors.surface,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
        gap: spacing.sm,
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: colors.surfaceSecondary,
        borderRadius: radius.lg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        minHeight: 40,
        maxHeight: 120,
    },
    input: {
        ...typography.styles.body,
        color: colors.textPrimary,
        padding: 0,
        margin: 0,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: radius.full,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: colors.border,
    },
    sendIcon: {
        color: colors.white,
        fontSize: 18,
    },
});
