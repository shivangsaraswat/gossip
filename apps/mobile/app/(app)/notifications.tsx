import React, { useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Icon } from '../../src/components/ui';
import { useNotifications, useFollows } from '../../src/hooks';
import { colors, spacing, typography, borderRadius } from '../../src/theme';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Notifications Screen
 * Displays connection requests and other notifications.
 */
export default function NotificationsScreen() {
    const router = useRouter();
    const {
        notifications,
        loading: notificationsLoading,
        fetchNotifications,
        removeNotification
    } = useNotifications();
    const {
        acceptFollowRequest,
        rejectFollowRequest,
        actionLoading
    } = useFollows();

    const handleAccept = useCallback(async (notification: any) => {
        if (!notification.referenceId) return;
        const success = await acceptFollowRequest(notification.referenceId);
        if (success) {
            removeNotification(notification.referenceId);
        }
    }, [acceptFollowRequest, removeNotification]);

    const handleReject = useCallback(async (notification: any) => {
        if (!notification.referenceId) return;
        const success = await rejectFollowRequest(notification.referenceId);
        if (success) {
            removeNotification(notification.referenceId);
        }
    }, [rejectFollowRequest, removeNotification]);

    const renderItem = ({ item }: { item: any }) => {
        // Only rendering connection requests for now based on specs
        if (item.type !== 'CONNECTION_REQUEST') return null;

        const isProcessing = actionLoading === item.referenceId;

        return (
            <View style={styles.itemContainer}>
                {/* Left: Avatar */}
                <View style={styles.avatarContainer}>
                    <LinearGradient
                        colors={['#E5E7EB', '#D1D5DB']}
                        style={styles.avatarPlaceholder}
                    >
                        <Text style={styles.avatarInitial}>
                            {item.actor.displayName?.[0]?.toUpperCase() || '?'}
                        </Text>
                    </LinearGradient>
                </View>

                {/* Middle: Content */}
                <View style={styles.contentContainer}>
                    <Text style={styles.username} numberOfLines={1}>
                        {item.actor.displayName}
                    </Text>
                    <Text style={styles.subtitle} numberOfLines={1}>
                        @{item.actor.username} • sent a request
                    </Text>
                </View>

                {/* Right: Actions */}
                <View style={styles.actionsContainer}>
                    {/* Accept Button */}
                    <TouchableOpacity
                        style={[styles.actionButton, styles.acceptButton, isProcessing && styles.disabledButton]}
                        onPress={() => handleAccept(item)}
                        disabled={isProcessing}
                    >
                        <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>

                    {/* Reject Button */}
                    <TouchableOpacity
                        style={[styles.actionButton, styles.rejectButton, isProcessing && styles.disabledButton]}
                        onPress={() => handleReject(item)}
                        disabled={isProcessing}
                    >
                        <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Icon name="chevron-back" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={styles.headerRight} />
            </View>

            {/* Section Label */}
            <View style={styles.sectionLabelContainer}>
                <Text style={styles.sectionLabel}>Connection requests</Text>
            </View>

            {/* List */}
            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshing={notificationsLoading}
                onRefresh={fetchNotifications}
                ListEmptyComponent={
                    !notificationsLoading ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No notifications</Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    // Header
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6', // Light gray
    },
    backButton: {
        paddingRight: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '500', // Medium
        color: colors.text,
        textAlign: 'center',
    },
    headerRight: {
        width: 22,
    },

    // Section Label
    sectionLabelContainer: {
        marginTop: 16,
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: '400', // Regular
        color: colors.textMuted,
    },

    // List
    listContent: {
        paddingBottom: 24,
    },

    // Item
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 64,
        paddingHorizontal: 16,
    },

    // Avatar
    avatarContainer: {
        marginRight: 12,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitial: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textSecondary,
    },

    // Content
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        marginRight: 8,
    },
    username: {
        fontSize: 14,
        fontWeight: '500', // Medium
        color: colors.text,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        color: colors.textMuted,
    },

    // Actions
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionButton: {
        height: 28,
        paddingHorizontal: 12,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    acceptButton: {
        backgroundColor: '#3B82F6', // Primary Blue
    },
    rejectButton: {
        backgroundColor: '#9CA3AF', // Neutral Gray (matches image style roughly)
    },
    disabledButton: {
        opacity: 0.6,
    },
    acceptButtonText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.white,
    },
    rejectButtonText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.white,
    },

    // Empty State
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        fontSize: 14,
        color: colors.textMuted,
    },
});
