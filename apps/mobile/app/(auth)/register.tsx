import { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button, Input, GossipLogo, PhoneInput, GradientBackground } from '../../src/components/ui';
import { useAuth } from '../../src/hooks';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

/**
 * Register Screen
 * Screen 4 - Complete registration with all details
 * 
 * Features:
 * - Gradient background
 * - Back arrow at top left
 * - Logo at top right
 * - "Register" title with subtitle
 * - Input fields: Username, Name, Email, Bio, Phone, Password
 * - Phone input with country selector
 * - "Register" primary button
 * - Footer: Already have an account? Log in
 */
export default function RegisterScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ username?: string }>();
    const { loading, error, checkUsername, register, clearError } = useAuth();

    const [username, setUsername] = useState(params.username || '');
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('IN');
    const [password, setPassword] = useState('');

    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [usernameChecking, setUsernameChecking] = useState(false);
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

    // Real-time username availability check
    useEffect(() => {
        if (username.length < 3) {
            setUsernameAvailable(null);
            return;
        }

        // Validate format first
        const usernameRegex = /^[a-z0-9_]+$/;
        if (!usernameRegex.test(username.toLowerCase())) {
            setLocalErrors((prev) => ({
                ...prev,
                username: 'Only lowercase letters, numbers, and underscores',
            }));
            setUsernameAvailable(null);
            return;
        }

        setLocalErrors((prev) => ({ ...prev, username: '' }));
        setUsernameChecking(true);

        const timer = setTimeout(async () => {
            const available = await checkUsername(username.toLowerCase());
            setUsernameAvailable(available);
            setUsernameChecking(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [username, checkUsername]);

    const validate = useCallback(() => {
        const errors: Record<string, string> = {};

        if (username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        } else if (usernameAvailable === false) {
            errors.username = 'Username is already taken';
        }

        if (!displayName.trim()) {
            errors.displayName = 'Name is required';
        }

        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Invalid email address';
        }

        if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        setLocalErrors(errors);
        return Object.keys(errors).length === 0;
    }, [username, displayName, email, password, usernameAvailable]);

    const isValid =
        username.length >= 3 &&
        displayName.trim() &&
        email.trim() &&
        password.length >= 8 &&
        usernameAvailable !== false;

    const handleSubmit = async () => {
        clearError();
        if (!validate()) return;

        const result = await register({
            displayName: displayName.trim(),
            email: email.trim().toLowerCase(),
            username: username.trim().toLowerCase(),
            password,
        });

        if (result.success && result.email) {
            router.replace({
                pathname: '/(auth)/otp',
                params: { email: result.email },
            });
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleCountryChange = (country: { code: string }) => {
        setCountryCode(country.code);
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    {/* Header with back button and logo */}
                    <View style={styles.topBar}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <Text style={styles.backArrow}>←</Text>
                        </TouchableOpacity>
                        <GossipLogo size={50} />
                    </View>

                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Register</Text>
                            <Text style={styles.subtitle}>
                                Create an account to continue!
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
                                placeholder="Username"
                                value={username}
                                onChangeText={(text) => setUsername(text.toLowerCase())}
                                error={localErrors.username}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <Input
                                placeholder="Name"
                                value={displayName}
                                onChangeText={setDisplayName}
                                error={localErrors.displayName}
                                autoCapitalize="words"
                            />

                            <Input
                                placeholder="Email@gmail.com"
                                value={email}
                                onChangeText={setEmail}
                                error={localErrors.email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <Input
                                placeholder="Bio"
                                value={bio}
                                onChangeText={setBio}
                                multiline
                                numberOfLines={2}
                            />

                            <PhoneInput
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                countryCode={countryCode}
                                onCountryChange={handleCountryChange}
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
                        </View>

                        {/* Button */}
                        <View style={styles.actions}>
                            <Button
                                title="Register"
                                onPress={handleSubmit}
                                disabled={!isValid}
                                loading={loading}
                            />
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Already have an account?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                                <Text style={styles.footerLink}>Log in</Text>
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
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    backArrow: {
        fontSize: 24,
        color: colors.text,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.xl,
    },
    header: {
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.display,
        color: colors.text,
        marginBottom: spacing.xs,
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
        marginBottom: spacing.lg,
    },
    actions: {
        marginBottom: spacing.lg,
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
