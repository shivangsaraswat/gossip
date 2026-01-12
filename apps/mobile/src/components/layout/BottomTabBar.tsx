import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { colors, spacing, typography } from '../../theme';

type TabKey = 'chats' | 'calls' | 'status' | 'profile';

interface TabItem {
    key: TabKey;
    label: string;
    icon: string;
    route: string;
}

const TABS: TabItem[] = [
    { key: 'chats', label: 'Chats', icon: '💬', route: '/(app)' },
    { key: 'calls', label: 'Calls', icon: '📞', route: '/(app)/calls' },
    { key: 'status', label: 'Status', icon: '◎', route: '/(app)/status' },
    { key: 'profile', label: 'Profile', icon: '👤', route: '/(app)/profile' },
];

interface BottomTabBarProps {
    /** Currently active tab */
    activeTab?: TabKey;
}

/**
 * BottomTabBar
 * WhatsApp-style bottom navigation:
 * - 4 tabs: Chats, Calls, Status, Profile
 * - Active tab uses primary color
 * - Inactive tabs: muted gray
 * - No heavy animations
 */
export function BottomTabBar({ activeTab }: BottomTabBarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const getActiveTab = (): TabKey => {
        if (activeTab) return activeTab;
        if (pathname.includes('/profile')) return 'profile';
        if (pathname.includes('/calls')) return 'calls';
        if (pathname.includes('/status')) return 'status';
        return 'chats';
    };

    const currentTab = getActiveTab();

    const handleTabPress = (tab: TabItem) => {
        if (tab.key === currentTab) return;
        router.push(tab.route as any);
    };

    return (
        <View style={styles.container}>
            {TABS.map((tab) => {
                const isActive = tab.key === currentTab;
                return (
                    <TouchableOpacity
                        key={tab.key}
                        style={styles.tab}
                        onPress={() => handleTabPress(tab)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.icon, isActive && styles.activeIcon]}>
                            {tab.icon}
                        </Text>
                        <Text style={[styles.label, isActive && styles.activeLabel]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
        paddingBottom: spacing.xs,
        paddingTop: spacing.sm,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xs,
    },
    icon: {
        fontSize: 20,
        marginBottom: spacing.xs / 2,
        opacity: 0.5,
    },
    activeIcon: {
        opacity: 1,
    },
    label: {
        ...typography.styles.meta,
        color: colors.textMuted,
    },
    activeLabel: {
        color: colors.primary,
        fontWeight: '600',
    },
});
