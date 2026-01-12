import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer, AppHeader, BottomTabBar } from '../../src/components/layout';
import { Avatar, Divider } from '../../src/components/ui';
import { useAuthStore } from '../../src/store';
import { colors, spacing, typography } from '../../src/theme';

/**
 * Profile Screen
 * User profile and settings
 * 
 * Composition:
 * - ScreenContainer
 * - AppHeader with back button
 * - Avatar (large)
 * - Profile info
 * - Settings list
 * - BottomTabBar
 */
export default function ProfileScreen() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        // Navigation handled by auth store state change
    };

    const displayName = user && 'displayName' in user ? user.displayName : 'User';
    const initials = displayName
        ?.split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2) || '?';

    return (
        <ScreenContainer padded={false} edges={['top', 'left', 'right']}>
            <AppHeader title="Profile" showBack />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.profileSection}>
                    <Avatar
                        source={(user as any)?.avatarUrl}
                        initials={initials}
                        size="lg"
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{displayName}</Text>
                    <Text style={styles.username}>@{(user as any)?.username || 'username'}</Text>
                    {(user as any)?.bio && <Text style={styles.bio}>{(user as any).bio}</Text>}
                </View>

                <Divider spacing="md" />

                <View style={styles.settingsSection}>
                    <Text style={styles.sectionTitle}>Settings</Text>

                    <TouchableOpacity style={styles.settingsItem}>
                        <Text style={styles.settingsLabel}>Edit Profile</Text>
                        <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingsItem}>
                        <Text style={styles.settingsLabel}>Notifications</Text>
                        <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingsItem}>
                        <Text style={styles.settingsLabel}>Privacy</Text>
                        <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingsItem}>
                        <Text style={styles.settingsLabel}>Help & Support</Text>
                        <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>
                </View>

                <Divider spacing="md" />

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>

            <BottomTabBar activeTab="profile" />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
        paddingHorizontal: spacing.md,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    avatar: {
        marginBottom: spacing.md,
    },
    name: {
        ...typography.styles.title,
        color: colors.textPrimary,
        marginBottom: spacing.xs / 2,
    },
    username: {
        fontSize: typography.body,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    bio: {
        fontSize: typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: spacing.xl,
    },
    settingsSection: {
        paddingVertical: spacing.md,
    },
    sectionTitle: {
        ...typography.styles.section,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    settingsItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    settingsLabel: {
        fontSize: typography.body,
        color: colors.textPrimary,
    },
    arrow: {
        fontSize: 16,
        color: colors.textMuted,
    },
    logoutButton: {
        paddingVertical: spacing.lg,
        alignItems: 'center',
    },
    logoutText: {
        fontSize: typography.body,
        color: colors.error,
        fontWeight: '600',
    },
});
