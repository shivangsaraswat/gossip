import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../../src/components/layout';
import { PrimaryButton } from '../../src/components/ui';
import { AuthTitle, OTPInput } from '../../src/components/auth';
import { useAuth } from '../../src/hooks';
import { colors, spacing, radius, typography } from '../../src/theme';

const RESEND_COOLDOWN = 60; // seconds

/**
 * OTP Verification Screen
 * Converts pending user to active user
 * 
 * Composition:
 * - ScreenContainer
 * - AuthTitle
 * - OTPInput component
 * - PrimaryButton
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

    const handleOtpComplete = (completedCode: string) => {
        setCode(completedCode);
        // Auto-verify handled by useEffect
    };

    // Auto-submit when code is complete
    useEffect(() => {
        if (code.length === 6) {
            handleVerify();
        }
    }, [code]);

    return (
        <ScreenContainer>
            <View style={styles.content}>
                <AuthTitle
                    title="Verify Your Email"
                    subtitle={`We sent a 6-digit code to`}
                    centered
                />
                <Text style={styles.email}>{email}</Text>

                {error && (
                    <View style={styles.errorBanner}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <View style={styles.otpContainer}>
                    <OTPInput
                        length={6}
                        onComplete={handleOtpComplete}
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
                <PrimaryButton
                    title="Verify"
                    onPress={handleVerify}
                    disabled={code.length !== 6}
                    loading={loading}
                />
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
    },
    email: {
        fontSize: typography.body,
        fontWeight: '600',
        color: colors.textPrimary,
        marginTop: -spacing.md,
        marginBottom: spacing.lg,
    },
    errorBanner: {
        backgroundColor: colors.error + '15',
        padding: spacing.md,
        borderRadius: radius.md,
        marginBottom: spacing.lg,
        alignItems: 'center',
        width: '100%',
    },
    errorText: {
        fontSize: typography.meta,
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
        fontSize: typography.body,
        color: colors.primary,
        fontWeight: '500',
    },
    cooldownText: {
        fontSize: typography.body,
        color: colors.textMuted,
    },
    actions: {
        paddingBottom: spacing.xl,
    },
});
