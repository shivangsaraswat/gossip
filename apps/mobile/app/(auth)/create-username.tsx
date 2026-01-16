import { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button, Input, GossipLogo, GradientBackground } from '../../src/components/ui';
import { colors, spacing, typography } from '../../src/theme';

/**
 * Create Username Screen
 * Screen 3 - First step in registration flow
 * 
 * Features:
 * - Gradient background
 * - Logo at top center
 * - "Create a username" title
 * - Subtitle explaining username creation
 * - Single username input field
 * - "Next" primary button
 * - Footer: Already have an account? Log in
 */
export default function CreateUsernameScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const validateUsername = useCallback((value: string) => {
        // Only lowercase letters, numbers, and underscores
        const usernameRegex = /^[a-z0-9_]+$/;

        if (value.length < 3) {
            return 'Username must be at least 3 characters';
        }

        if (!usernameRegex.test(value)) {
            return 'Only lowercase letters, numbers, and underscores allowed';
        }

        return '';
    }, []);

    const handleNext = () => {
        const validationError = validateUsername(username);
        if (validationError) {
            setError(validationError);
            return;
        }

        // Navigate to register with username
        router.push({
            pathname: '/(auth)/register',
            params: { username: username.toLowerCase() },
        });
    };

    const handleUsernameChange = (text: string) => {
        const lowercaseText = text.toLowerCase().replace(/\s/g, '');
        setUsername(lowercaseText);
        if (error) {
            setError('');
        }
    };

    const isValid = username.length >= 3;

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.content}>
                        {/* Logo */}
                        <View style={styles.logoContainer}>
                            <GossipLogo size={60} />
                        </View>

                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Create a username</Text>
                            <Text style={styles.subtitle}>
                                To begin creating an account, add a username or use our suggestion. You can change this at any time.
                            </Text>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            <Input
                                placeholder="username"
                                value={username}
                                onChangeText={handleUsernameChange}
                                error={error}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        {/* Button */}
                        <View style={styles.actions}>
                            <Button
                                title="Next"
                                onPress={handleNext}
                                disabled={!isValid}
                            />
                        </View>

                        {/* Spacer */}
                        <View style={styles.spacer} />

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Already have an account?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                                <Text style={styles.footerLink}>Log in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.display,
        color: colors.text,
        marginBottom: spacing.md,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        lineHeight: 22,
    },
    form: {
        marginBottom: spacing.lg,
    },
    actions: {
        marginBottom: spacing.lg,
    },
    spacer: {
        flex: 1,
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
