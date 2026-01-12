import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Button, OtpInput } from '../../src/components/ui';
import { useAuth } from '../../src/hooks';
import { colors, spacing, typography } from '../../src/theme';

const RESEND_COOLDOWN = 60; // seconds

/**
 * OTP Verification Screen
 * Converts pending user to active user
 */
export default function OtpScreen() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const { loading, error, verifyOtp, resendOtp, clearError } = useAuth();

    const [code, setCode] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);

    // Cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;

        const timer = setInterval(() => {
            setResendCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleVerify = async () => {
        if (code.length !== 6 || !email) return;
        clearError();
        await verifyOtp({ email, code });
        // Navigation handled by auth store state change
    };

    const handleResend = async () => {
        if (!email || resendCooldown > 0) return;
        clearError();
        const success = await resendOtp(email);
        if (success) {
            setResendCooldown(RESEND_COOLDOWN);
        }
    };

    // Auto-submit when code is complete
    useEffect(() => {
        if (code.length === 6) {
            handleVerify();
        }
    }, [code]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Verify Your Email</Text>
                    <Text style={styles.subtitle}>
                        We sent a 6-digit code to
                    </Text>
                    <Text style={styles.email}>{email}</Text>
                </View>

                {error && (
                    <View style={styles.errorBanner}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <View style={styles.otpContainer}>
                    <OtpInput
                        value={code}
                        onChange={setCode}
                        error={!!error}
                    />
                </View>

                <View style={styles.resendContainer}>
                    {resendCooldown > 0 ? (
                        <Text style={styles.cooldownText}>
                            Resend code in {resendCooldown}s
                        </Text>
                    ) : (
                        <TouchableOpacity onPress={handleResend} disabled={loading}>
                            <Text style={styles.resendText}>Resend Code</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.actions}>
                <Button
                    title="Verify"
                    onPress={handleVerify}
                    disabled={code.length !== 6}
                    loading={loading}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
    },
    header: {
        marginTop: spacing.xxl,
        marginBottom: spacing.xl,
        alignItems: 'center',
    },
    title: {
        ...typography.h1,
        color: colors.text,
        marginBottom: spacing.md,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
    },
    email: {
        ...typography.body,
        fontWeight: '600',
        color: colors.text,
        marginTop: spacing.xs,
    },
    errorBanner: {
        backgroundColor: colors.error + '20',
        padding: spacing.md,
        borderRadius: 8,
        marginBottom: spacing.lg,
        alignItems: 'center',
    },
    errorText: {
        ...typography.bodySmall,
        color: colors.error,
    },
    otpContainer: {
        marginVertical: spacing.xl,
    },
    resendContainer: {
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    resendText: {
        ...typography.body,
        color: colors.primary,
    },
    cooldownText: {
        ...typography.body,
        color: colors.textMuted,
    },
    actions: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
    },
});
