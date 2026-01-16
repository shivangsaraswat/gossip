import { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button, Input, GossipLogo, GradientBackground } from '../../src/components/ui';
import { useAuth } from '../../src/hooks';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

/**
 * Sign In Screen
 * Screen 2 - Authenticate existing users
 * 
 * Features:
 * - Gradient background (blue to white)
 * - Logo at top center
 * - Sign in to your Account title
 * - Username/email and password inputs
 * - Remember me checkbox + Forgot Password link
 * - Sign in button + Continue with Google
 * - Footer: Don't have an account? Sign Up
 */
export default function LoginScreen() {
    const router = useRouter();
    const { loading, error, login, clearError } = useAuth();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

    const validate = useCallback(() => {
        const errors: Record<string, string> = {};

        if (!identifier.trim()) {
            errors.identifier = 'Email or username is required';
        }

        if (!password) {
            errors.password = 'Password is required';
        }

        setLocalErrors(errors);
        return Object.keys(errors).length === 0;
    }, [identifier, password]);

    const isValid = identifier.trim() && password;

    const handleSubmit = async () => {
        clearError();
        if (!validate()) return;

        await login({
            identifier: identifier.trim().toLowerCase(),
            password,
        });
        // Navigation handled by auth store state change
    };

    const handleGoogleSignIn = () => {
        // TODO: Implement Google Sign In
        console.log('Google Sign In pressed');
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Logo */}
                        <View style={styles.logoContainer}>
                            <GossipLogo size={60} />
                        </View>

                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Sign in to your{'\n'}Account</Text>
                            <Text style={styles.subtitle}>
                                Enter your email and password to log in
                            </Text>
                        </View>

                        {/* Error Banner */}
                        {error && (
                            <View style={styles.errorBanner}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        {/* Form */}
                        <View style={styles.form}>
                            <Input
                                placeholder="username/email"
                                value={identifier}
                                onChangeText={setIdentifier}
                                error={localErrors.identifier}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <Input
                                placeholder="••••••"
                                value={password}
                                onChangeText={setPassword}
                                error={localErrors.password}
                                secureTextEntry
                                showPasswordToggle
                                autoCapitalize="none"
                            />

                            {/* Remember me & Forgot Password */}
                            <View style={styles.optionsRow}>
                                <TouchableOpacity
                                    style={styles.checkboxContainer}
                                    onPress={() => setRememberMe(!rememberMe)}
                                >
                                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                        {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                                    </View>
                                    <Text style={styles.checkboxLabel}>Remember me</Text>
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <Text style={styles.forgotPassword}>Forgot Password ?</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>Or</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Buttons */}
                        <View style={styles.actions}>
                            <Button
                                title="Sign in"
                                onPress={handleSubmit}
                                disabled={!isValid}
                                loading={loading}
                            />

                            <View style={styles.spacer} />

                            <Button
                                title="Continue with Google"
                                onPress={handleGoogleSignIn}
                                variant="google"
                                icon={<Text style={styles.googleIcon}>G</Text>}
                            />
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Don't have an account?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/create-username' as any)}>
                                <Text style={styles.footerLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.xl,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: spacing.xl,
        marginBottom: spacing.lg,
    },
    header: {
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.display,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
    },
    errorBanner: {
        backgroundColor: colors.error + '20',
        padding: spacing.md,
        borderRadius: borderRadius.sm,
        marginBottom: spacing.md,
    },
    errorText: {
        ...typography.bodySmall,
        color: colors.error,
    },
    form: {
        marginBottom: spacing.md,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    checkboxChecked: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    checkmark: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '700',
    },
    checkboxLabel: {
        ...typography.bodySmall,
        color: colors.text,
    },
    forgotPassword: {
        ...typography.bodySmall,
        color: colors.primary,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.md,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerText: {
        ...typography.bodySmall,
        color: colors.textMuted,
        marginHorizontal: spacing.md,
    },
    actions: {
        marginBottom: spacing.lg,
    },
    spacer: {
        height: spacing.md,
    },
    googleIcon: {
        fontSize: 18,
        fontWeight: '700',
        color: '#4285F4',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: spacing.xl,
    },
    footerText: {
        ...typography.body,
        color: colors.textSecondary,
    },
    footerLink: {
        ...typography.body,
        color: colors.primary,
        fontWeight: '600',
    },
});
