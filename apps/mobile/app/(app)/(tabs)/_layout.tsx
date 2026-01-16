import { Tabs } from 'expo-router';
import { StyleSheet, Platform, View } from 'react-native';
import { Icon } from '../../../src/components/ui';
import { colors, spacing, typography } from '../../../src/theme';

/**
 * Bottom Tab Navigator
 * Main navigation for authenticated users
 * Tabs: Chats, Communities, Calls, Profile
 */
export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: '#9CA3AF', // Gray-400
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarIconStyle: styles.tabBarIcon,
            }}
        >
            <Tabs.Screen
                name="chats"
                options={{
                    title: 'Chats',
                    tabBarIcon: ({ color, focused }) => (
                        <Icon name="chat" size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
                    ),
                }}
            />
            <Tabs.Screen
                name="communities"
                options={{
                    title: 'Communities',
                    tabBarIcon: ({ color, focused }) => (
                        <Icon name="people" size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
                    ),
                }}
            />
            <Tabs.Screen
                name="calls"
                options={{
                    title: 'Calls',
                    tabBarIcon: ({ color, focused }) => (
                        <Icon name="call" size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <Icon name="settings" size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        height: Platform.OS === 'ios' ? 88 : 64,
        paddingBottom: Platform.OS === 'ios' ? 28 : 8,
        paddingTop: spacing.sm,
    },
    tabBarLabel: {
        ...typography.caption,
        fontWeight: '500',
        fontSize: 10,
        marginTop: 2,
    },
    tabBarIcon: {
        marginBottom: -2,
    },
});
