import { Stack } from 'expo-router';

/**
 * Auth Group Layout
 * Contains onboarding screens: welcome, register, login, OTP
 */
export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        />
    );
}
