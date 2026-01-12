import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../src/store';

/**
 * Root Layout
 * State-driven navigation based on auth status
 */
export default function RootLayout() {
    const router = useRouter();
    const segments = useSegments();
    const status = useAuthStore((state) => state.status);
    const initializeSession = useAuthStore((state) => state.initializeSession);

    // Initialize session on mount
    useEffect(() => {
        initializeSession();
    }, [initializeSession]);

    // State-driven routing
    useEffect(() => {
        if (status === 'loading') {
            // Still loading, don't navigate
            return;
        }

        const inAuthGroup = segments[0] === '(auth)';
        const inAppGroup = segments[0] === '(app)';

        if (status === 'logged_out' && !inAuthGroup) {
            // Redirect to auth flow
            router.replace('/(auth)/welcome');
        } else if (status === 'pending_verification' && !inAuthGroup) {
            // Redirect to OTP verification
            router.replace('/(auth)/otp');
        } else if (status === 'active' && !inAppGroup) {
            // Redirect to main app
            router.replace('/(app)/home');
        }
    }, [status, segments, router]);

    return (
        <>
            <StatusBar style="auto" />
            <Slot />
        </>
    );
}
