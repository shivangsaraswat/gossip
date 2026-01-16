import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Button, OtpInput, GossipLogo, GradientBackground } from '../../src/components/ui';
import { useAuth } from '../../src/hooks';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

const RESEND_COOLDOWN = 60; // seconds

/**
 * OTP Verification Screen
 * Screen 5 - Verify email with 6-digit code
 * 
 * Features:
 * - Gradient background
 * - Logo at top center
 * - "Verify your account" title
 * - Subtitle with email info
 * - 6 OTP input boxes (equal width, rounded, centered)
 * - "Verify" primary button
 * - "Didn't receive the code? Resend" link
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
        <GradientBackground>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <GossipLogo size={60} />
                    </View>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Verify your account</Text>
                        <Text style={styles.subtitle}>
                            Enter the 6-digit code sent to your email
                        </Text>
                        {email && (
                            <Text style={styles.email}>{email}</Text>
                        )}
                    </View>

                    {/* Error Banner */}
                    {error && (
                        <View style={styles.errorBanner}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    {/* OTP Input */}
                    <View style={styles.otpContainer}>
                        <OtpInput
                            value={code}
                            onChange={setCode}
                            error={!!error}
                        />
                    </View>

                    {/* Verify Button */}
                    <View style={styles.actions}>
                        <Button
                            title="Verify"
                            onPress={handleVerify}
                            disabled={code.length !== 6}
                            loading={loading}
                        />
                    </View>

                    {/* Resend Link */}
                    <View style={styles.resendContainer}>
                        {resendCooldown > 0 ? (
                            <Text style={styles.cooldownText}>
                                Resend code in {resendCooldown}s
                            </Text>
                        ) : (
                            <View style={styles.resendRow}>
                                <Text style={styles.resendText}>
                                    Didn't receive the code?{' '}
                                </Text>
                                <TouchableOpacity onPress={handleResend} disabled={loading}>
                                    <Text style={styles.resendLink}>Resend</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: spacing.xl,
        marginBottom: spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.display,
        color: colors.text,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
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
        borderRadius: borderRadius.sm,
        marginBottom: spacing.lg,
        alignItems: 'center',
    },
    errorText: {
        ...typography.bodySmall,
        color: colors.error,
    },
    otpContainer: {
        marginBottom: spacing.xl,
    },
    actions: {
        marginBottom: spacing.lg,
    },
    resendContainer: {
        alignItems: 'center',
    },
    resendRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resendText: {
        ...typography.body,
        color: colors.textSecondary,
    },
    resendLink: {
        ...typography.body,
        color: colors.primary,
        fontWeight: '600',
    },
    cooldownText: {
        ...typography.body,
        color: colors.textMuted,
    },
});
