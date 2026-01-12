import React, { useRef, useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
} from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';

interface OTPInputProps {
    /** Number of digits */
    length?: number;
    /** Callback when all digits are entered */
    onComplete?: (code: string) => void;
    /** Callback on code change */
    onChange?: (code: string) => void;
    /** Error state */
    error?: boolean;
}

/**
 * OTPInput
 * 6-box OTP input with auto-advance:
 * - Center aligned
 * - Fixed width boxes
 * - Auto-advance on input
 * - Backspace handling
 */
export function OTPInput({
    length = 6,
    onComplete,
    onChange,
    error = false,
}: OTPInputProps) {
    const [values, setValues] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const handleChange = (text: string, index: number) => {
        const digit = text.replace(/[^0-9]/g, '').slice(-1);
        const newValues = [...values];
        newValues[index] = digit;
        setValues(newValues);

        const code = newValues.join('');
        onChange?.(code);

        // Auto-advance to next input
        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Check completion
        if (code.length === length && !code.includes('')) {
            onComplete?.(code);
        }
    };

    const handleKeyPress = (
        e: NativeSyntheticEvent<TextInputKeyPressEventData>,
        index: number
    ) => {
        if (e.nativeEvent.key === 'Backspace' && !values[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.container}>
            {Array.from({ length }).map((_, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => {
                        inputRefs.current[index] = ref;
                    }}
                    style={[
                        styles.box,
                        values[index] && styles.boxFilled,
                        error && styles.boxError,
                    ]}
                    value={values[index]}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textContentType="oneTimeCode"
                    autoComplete="one-time-code"
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
    box: {
        width: 48,
        height: 56,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        textAlign: 'center',
        fontSize: typography.title,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    boxFilled: {
        borderColor: colors.primary,
        backgroundColor: colors.primarySoft,
    },
    boxError: {
        borderColor: colors.error,
    },
});
