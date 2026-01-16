import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';

interface OtpInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
}

/**
 * OTP Input Component
 * 6 equal-width boxes with rounded corners
 * Light theme matching Figma design
 */
export function OtpInput({ length = 6, value, onChange, error }: OtpInputProps) {
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const handleChange = (text: string, index: number) => {
        // Only allow digits
        const digit = text.replace(/[^0-9]/g, '').slice(-1);

        // Update value
        const newValue = value.split('');
        newValue[index] = digit;
        const updatedValue = newValue.join('').slice(0, length);
        onChange(updatedValue);

        // Auto-advance to next input
        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-dismiss keyboard when complete
        if (updatedValue.length === length) {
            Keyboard.dismiss();
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.container}>
            {Array.from({ length }).map((_, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => { inputRefs.current[index] = ref; }}
                    style={[
                        styles.input,
                        focusedIndex === index && styles.focused,
                        error && styles.error,
                        value[index] && styles.filled,
                    ]}
                    value={value[index] || ''}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.sm,
    },
    input: {
        width: 48,
        height: 56,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.sm,
        textAlign: 'center',
        ...typography.h2,
        color: colors.text,
    },
    focused: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    error: {
        borderColor: colors.error,
    },
    filled: {
        borderColor: colors.primary,
        backgroundColor: colors.primarySoft,
    },
});
