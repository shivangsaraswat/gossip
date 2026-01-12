import { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button, Input } from '../../src/components/ui';
import { useAuth } from '../../src/hooks';
import { colors, spacing, typography } from '../../src/theme';

/**
 * Register Screen
 * Creates new account with real-time username validation
 */
export default function RegisterScreen() {
    const router = useRouter();
    const { loading, error, checkUsername, register, clearError } = useAuth();

    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
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

        if (!displayName.trim()) {
            errors.displayName = 'Display name is required';
        }

        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Invalid email address';
        }

        if (username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        } else if (usernameAvailable === false) {
            errors.username = 'Username is already taken';
        }

        if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        setLocalErrors(errors);
        return Object.keys(errors).length === 0;
    }, [displayName, email, username, password, usernameAvailable]);

    const isValid =
        displayName.trim() &&
        email.trim() &&
        username.length >= 3 &&
        usernameAvailable === true &&
        password.length >= 8;

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

    const getUsernameHint = () => {
        if (usernameChecking) return 'Checking availability...';
        if (usernameAvailable === true) return '✓ Username available';
        if (usernameAvailable === false) return 'Username is taken';
        return 'Lowercase letters, numbers, underscores';
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>
                            Join Gossip and connect with others
                        </Text>
                    </View>

                    {error && (
                        <View style={styles.errorBanner}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <View style={styles.form}>
                        <Input
                            label="Display Name"
                            placeholder="Your name"
                            value={displayName}
                            onChangeText={setDisplayName}
                            error={localErrors.displayName}
                            autoCapitalize="words"
                        />

                        <Input
                            label="Email"
                            placeholder="you@example.com"
                            value={email}
                            onChangeText={setEmail}
                            error={localErrors.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Input
                            label="Username"
                            placeholder="your_username"
                            value={username}
                            onChangeText={(text) => setUsername(text.toLowerCase())}
                            error={localErrors.username}
                            hint={getUsernameHint()}
                            success={usernameAvailable === true}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Input
                            label="Password"
                            placeholder="Minimum 8 characters"
                            value={password}
                            onChangeText={setPassword}
                            error={localErrors.password}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.actions}>
                        <Button
                            title="Create Account"
                            onPress={handleSubmit}
                            disabled={!isValid}
                            loading={loading}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.xl,
    },
    header: {
        marginTop: spacing.xl,
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h1,
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
        borderRadius: 8,
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
        marginTop: 'auto',
        paddingBottom: spacing.xl,
    },
});
