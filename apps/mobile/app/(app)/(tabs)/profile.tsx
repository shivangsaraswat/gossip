import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../src/store';
import { colors, typography, spacing, borderRadius } from '../../../src/theme';

/**
 * Profile Tab
 * Shows current user info with logout option
 */
export default function ProfileScreen() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const displayName = user && 'displayName' in user ? user.displayName : 'User';
    const username = user && 'username' in user ? user.username : '';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>
                        {displayName.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <Text style={styles.displayName}>{displayName}</Text>
                {username ? (
                    <Text style={styles.username}>@{username}</Text>
                ) : null}
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
    },
    title: {
        ...typography.h1,
        color: colors.text,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: spacing.xxl,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    avatarText: {
        ...typography.display,
        color: colors.white,
        fontSize: 40,
    },
    displayName: {
        ...typography.h2,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    username: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: spacing.xl,
    },
    logoutButton: {
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    logoutText: {
        ...typography.body,
        color: colors.error,
        fontWeight: '500',
    },
});
