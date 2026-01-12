import { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/layout';
import { PrimaryButton, TextInput } from '../../src/components/ui';
import { AuthTitle, AuthFooter } from '../../src/components/auth';
import { useAuth } from '../../src/hooks';
import { colors, spacing, radius } from '../../src/theme';

/**
 * Login Screen
 * Authenticates existing users
 * 
 * Composition:
 * - ScreenContainer
 * - AuthTitle
 * - TextInput stack
 * - PrimaryButton
 * - AuthFooter
 */
export default function LoginScreen() {
    const router = useRouter();
    const { loading, error, login, clearError } = useAuth();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
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

    return (
        <ScreenContainer>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    <AuthTitle
                        title="Welcome Back"
                        subtitle="Log in to continue"
                    />

                    {error && (
                        <View style={styles.errorBanner}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <View style={styles.form}>
                        <TextInput
                            label="Email or Username"
                            placeholder="you@example.com"
                            value={identifier}
                            onChangeText={setIdentifier}
                            error={localErrors.identifier}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <TextInput
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            error={localErrors.password}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <View style={styles.actions}>
                    <PrimaryButton
                        title="Log In"
                        onPress={handleSubmit}
                        disabled={!isValid}
                        loading={loading}
                    />

                    <AuthFooter
                        question="Don't have an account?"
                        linkText="Sign up"
                        onLinkPress={() => router.push('/(auth)/signup' as any)}
                    />
                </View>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    errorBanner: {
        backgroundColor: colors.error + '15',
        padding: spacing.md,
        borderRadius: radius.md,
        marginBottom: spacing.md,
    },
    errorText: {
        fontSize: 14,
        color: colors.error,
    },
    form: {
        marginBottom: spacing.lg,
    },
    actions: {
        paddingBottom: spacing.xl,
    },
});
