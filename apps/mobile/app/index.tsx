import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '../src/store';

/**
 * Session Resolver (Index Route)
 * 
 * This screen never renders meaningful UI.
 * It exists only to:
 * - Restore tokens
 * - Validate session with backend
 * - Resolve correct auth state
 * 
 * Navigation happens in _layout.tsx based on auth status
 */
export default function SessionResolver() {
    const status = useAuthStore((state) => state.status);

    // Show loading indicator while resolving
    if (status === 'loading') {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    // Navigation is handled by _layout.tsx
    // Return empty view as fallback (should never be visible)
    return <View style={styles.container} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
});
