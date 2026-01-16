import { Stack } from 'expo-router';

/**
 * Auth Group Layout
 * Contains onboarding screens: welcome, login, create-username, register, OTP
 */
export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: {
                    backgroundColor: 'transparent',
                },
            }}
        >
            <Stack.Screen name="welcome" />
            <Stack.Screen name="login" />
            <Stack.Screen name="create-username" />
            <Stack.Screen name="register" />
            <Stack.Screen name="otp" />
        </Stack>
    );
}
