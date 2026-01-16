import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useEffect, useState } from 'react';
import { GossipLogo, GradientBackground } from '../../src/components/ui';
import { spacing, typography, colors } from '../../src/theme';

/**
 * Splash / Welcome Screen
 * Screen 1 - Clean, calm first impression
 * 
 * Features:
 * - Light blue to white gradient background
 * - Centered infinity-fish logo
 * - App name "Gossip" below logo
 * - Auto-navigates to login after delay
 */
export default function WelcomeScreen() {
    const router = useRouter();
    const rootNavigationState = useRootNavigationState();
    const [hasNavigated, setHasNavigated] = useState(false);

    // Wait for navigation to be ready before navigating
    useEffect(() => {
        if (!rootNavigationState?.key || hasNavigated) return;

        const timer = setTimeout(() => {
            setHasNavigated(true);
            router.replace('/(auth)/login');
        }, 2500);

        return () => clearTimeout(timer);
    }, [rootNavigationState?.key, hasNavigated, router]);

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <GossipLogo size={120} />
                    </View>

                    {/* App Name */}
                    <Text style={styles.appName}>Gossip</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    logoContainer: {
        marginBottom: spacing.lg,
    },
    appName: {
        ...typography.display,
        fontSize: 32,
        color: colors.text,
        letterSpacing: 1,
    },
});
