import { Stack } from 'expo-router';

/**
 * App Group Layout
 * Contains main app screens after authentication
 */
export default function AppLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    );
}
