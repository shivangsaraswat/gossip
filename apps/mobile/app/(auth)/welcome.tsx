import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../../src/components/ui';
import { colors, spacing, typography } from '../../src/theme';

/**
 * Welcome Screen
 * Entry point for unauthenticated users
 */
export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Logo Area */}
                <View style={styles.logoContainer}>
                    <View style={styles.logo}>
                        <Text style={styles.logoText}>G</Text>
                    </View>
                    <Text style={styles.title}>Gossip</Text>
                </View>

                {/* Value Statement */}
                <Text style={styles.tagline}>
                    Connect with people who matter
                </Text>
            </View>

            {/* CTAs */}
            <View style={styles.actions}>
                <Button
                    title="Create Account"
                    onPress={() => router.push('/(auth)/register')}
                />
                <View style={styles.spacer} />
                <Button
                    title="Log In"
                    variant="outline"
                    onPress={() => router.push('/(auth)/login')}
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    logoText: {
        ...typography.h1,
        fontSize: 40,
        color: colors.text,
    },
    title: {
        ...typography.h1,
        color: colors.text,
    },
    tagline: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    actions: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    spacer: {
        height: spacing.md,
    },
});
