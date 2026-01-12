import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/layout';
import { PrimaryButton, SecondaryButton } from '../../src/components/ui';
import { Logo } from '../../src/components/common';
import { colors, spacing, typography } from '../../src/theme';

/**
 * Welcome Screen
 * Entry point for unauthenticated users
 * 
 * Composition:
 * - ScreenContainer
 * - Logo (large)
 * - Title + Subtitle text
 * - PrimaryButton (Sign Up)
 * - SecondaryButton (Sign In)
 */
export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <ScreenContainer padded={false}>
            <View style={styles.content}>
                <Logo size="large" showName />
                <Text style={styles.tagline}>
                    Connect with people who matter
                </Text>
            </View>

            <View style={styles.actions}>
                <PrimaryButton
                    title="Create Account"
                    onPress={() => router.push('/(auth)/signup' as any)}
                />
                <View style={styles.spacer} />
                <SecondaryButton
                    title="Log In"
                    onPress={() => router.push('/(auth)/login')}
                />
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    tagline: {
        fontSize: typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.lg,
    },
    actions: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    spacer: {
        height: spacing.md,
    },
});
