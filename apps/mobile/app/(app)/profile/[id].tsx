import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '../../../src/components/ui';
import { colors, spacing, typography, borderRadius } from '../../../src/theme';
import { useProfile, useFollows } from '../../../src/hooks';
import {
    ProfileStatusNone,
    ProfileStatusRequested,
    ProfileStatusConnected,
} from '../../../src/components/profile';

/**
 * User Profile Screen
 * Dynamic screen rendering based on relationshipStatus source of truth.
 */
export default function UserProfileScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const userId = id as string;

    // 1. Fetch Data
    const { user, loading: profileLoading } = useProfile(userId);
    const {
        getRelationshipStatus,
        sendFollowRequest,
        unfollow,
        acceptFollowRequest,
        actionLoading,
    } = useFollows();

    // 2. State
    const [status, setStatus] = React.useState<'none' | 'requested' | 'incoming' | 'connected' | null>(null);
    const [loading, setLoading] = React.useState(true);

    // 3. Status Fetcher (Source of Truth)
    const fetchStatus = useCallback(async () => {
        if (!userId) return;
        const result = await getRelationshipStatus(userId);
        if (result) {
            setStatus(result);
        }
        setLoading(false);
    }, [userId, getRelationshipStatus]);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    // 4. Action Handlers
    const handleConnect = async () => {
        const success = await sendFollowRequest(userId);
        if (success) fetchStatus();
    };

    const handleMessage = () => {
        // Navigate to chat
        console.log('Navigate to chat with', userId);
        // router.push(`/chat/${userId}`);
    };

    const handleBlock = () => {
        console.log('Block user', userId);
    };

    const handleReport = () => {
        console.log('Report user', userId);
    };

    // 5. Render Logic
    if (profileLoading || loading || !user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContent}>
                    <Text>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const renderActionSection = () => {
        switch (status) {
            case 'none':
                return (
                    <ProfileStatusNone
                        onConnect={handleConnect}
                        onMessage={() => { }} // Disabled
                        loading={actionLoading === userId}
                    />
                );
            case 'requested':
                return (
                    <ProfileStatusRequested />
                );
            case 'connected':
                return (
                    <ProfileStatusConnected
                        onMessage={handleMessage}
                        onBlock={handleBlock}
                        onReport={handleReport}
                    />
                );
            case 'incoming':
                // Fallback for incoming separate from spec, or treat as None with accept?
                // Spec didn't define Screen for Incoming.
                // We'll show a basic "Request Received" state for now to avoid broken UI.
                return (
                    <View style={styles.incomingContainer}>
                        <Text style={styles.incomingText}>Request Received</Text>
                    </View>
                );
            default:
                return null;
        }
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
                    <Icon name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>{user.username}</Text>
                    {/* Verified badge placeholder if needed */}
                    <Icon name="checkmark-circle" size={16} color="#3B82F6" style={{ marginLeft: 4 }} />
                </View>
                <TouchableOpacity style={styles.menuButton}>
                    <Icon name="ellipsis-vertical" size={20} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* Profile Content */}
            <View style={styles.content}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    <LinearGradient
                        colors={['#3B82F6', '#2563EB']} // Blue ring border gradient
                        style={styles.avatarRing}
                    >
                        <View style={styles.avatarInner}>
                            <Text style={styles.avatarInitial}>
                                {user.displayName?.[0]?.toUpperCase()}
                            </Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Name & Bio */}
                <View style={styles.infoContainer}>
                    <Text style={styles.displayName}>{user.displayName}</Text>
                    <Text style={styles.bio}>
                        {user.bio || 'when topic is you, you know i don’t lie'}
                        {/* Placeholder bio from design if empty */}
                    </Text>
                    {/* Phone placeholder if connected? Spec says "Optional phone number" */}
                    {status === 'connected' && (
                        <View style={styles.phoneContainer}>
                            <Icon name="phone-portrait-outline" size={14} color={colors.textSecondary} />
                            <Text style={styles.phoneText}>+91 6328102514</Text>
                        </View>
                    )}
                </View>

                {/* Status Component */}
                <View style={styles.actionContainer}>
                    {renderActionSection()}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F9FF', // Light gradient bg simulation
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Header
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    backButton: {
        padding: 4,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    menuButton: {
        padding: 4,
    },

    // Content
    content: {
        alignItems: 'center',
        paddingTop: 24,
        paddingHorizontal: 24,
    },

    // Avatar
    avatarContainer: {
        marginBottom: 16,
    },
    avatarRing: {
        width: 104, // 96 + border
        height: 104,
        borderRadius: 52,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInner: {
        width: 96, // Spec: 96px
        height: 96,
        borderRadius: 48,
        backgroundColor: colors.surface, // Or image
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#F0F9FF', // Match bg to create gap effect? Or white
    },
    avatarInitial: {
        fontSize: 32,
        fontWeight: '600',
        color: colors.textSecondary,
    },

    // Info
    infoContainer: {
        alignItems: 'center',
        marginBottom: 24,
        width: '100%',
    },
    displayName: {
        fontSize: 20,
        fontWeight: '700', // Bold
        color: colors.text,
        marginBottom: 4,
        textAlign: 'center',
    },
    bio: {
        fontSize: 14,
        color: '#4B5563', // Muted
        textAlign: 'center',
        maxWidth: '80%',
        lineHeight: 20,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 4,
    },
    phoneText: {
        fontSize: 14,
        color: colors.textSecondary,
    },

    // Actions
    actionContainer: {
        width: '100%',
    },

    // Incoming Placeholder
    incomingContainer: {
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#EFF6FF',
        borderRadius: 8,
    },
    incomingText: {
        color: '#3B82F6',
        fontWeight: '500',
    },
});
