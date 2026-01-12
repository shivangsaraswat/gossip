import { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '../../src/components/ui';
import { useAuth } from '../../src/hooks';
import { colors, spacing, typography } from '../../src/theme';

/**
 * Login Screen
 * Authenticates existing users
 */
export default function LoginScreen() {
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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>
                            Log in to continue
                        </Text>
                    </View>

                    {error && (
                        <View style={styles.errorBanner}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <View style={styles.form}>
                        <Input
                            label="Email or Username"
                            placeholder="you@example.com"
                            value={identifier}
                            onChangeText={setIdentifier}
                            error={localErrors.identifier}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Input
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
                    <Button
                        title="Log In"
                        onPress={handleSubmit}
                        disabled={!isValid}
                        loading={loading}
                    />
                </View>
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
    content: {
        flex: 1,
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
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
    },
});
