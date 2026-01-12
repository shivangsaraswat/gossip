import { useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../src/components/layout';
import { Avatar } from '../../src/components/ui';
import { useAuthStore } from '../../src/store';
import { colors, spacing, radius, typography } from '../../src/theme';

interface ChatItem {
    id: string;
    name: string;
    message: string;
    time: string;
    avatarUrl?: string;
    unreadCount?: number;
    isPinned?: boolean;
    isRead?: boolean;
}

interface StoryItem {
    id: string;
    name: string;
    avatarUrl?: string;
    verified?: boolean;
}

/**
 * Chat Home Screen
 * Functional implementation with real icons and conditional sections
 */
export default function ChatHomeScreen() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    // TODO: Replace with real chat data from API/hooks when available
    // For now, starts empty - no hardcoded mock data
    const [chats] = useState<ChatItem[]>([]);
    const [stories] = useState<StoryItem[]>([]);

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'unread', label: 'Unread Chats' },
        { id: 'groups', label: 'Group Chats' },
        { id: 'favourites', label: 'Favourites' },
    ];

    // Filter chats based on search and active filter
    const filteredChats = useMemo(() => {
        let result = chats;

        // Search filter
        if (searchQuery.trim()) {
            result = result.filter(chat =>
                chat.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Tab filter
        switch (activeFilter) {
            case 'unread':
                result = result.filter(chat => chat.unreadCount && chat.unreadCount > 0);
                break;
            case 'groups':
                // TODO: Add group chat filter when group property is available
                break;
            case 'favourites':
                // TODO: Add favourites filter when favourite property is available
                break;
        }

        return result;
    }, [chats, searchQuery, activeFilter]);

    // Separate pinned and unpinned chats
    const pinnedChats = useMemo(() =>
        filteredChats.filter(chat => chat.isPinned), [filteredChats]);
    const regularChats = useMemo(() =>
        filteredChats.filter(chat => !chat.isPinned), [filteredChats]);

    const handleChatPress = useCallback((chatId: string) => {
        router.push({ pathname: '/(app)/chat/[id]', params: { id: chatId } } as any);
    }, [router]);

    const renderChatItem = useCallback((item: ChatItem) => {
        const initials = item.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?';

        return (
            <TouchableOpacity
                key={item.id}
                style={styles.chatItem}
                onPress={() => handleChatPress(item.id)}
                activeOpacity={0.7}
            >
                <View style={styles.avatarContainer}>
                    <Avatar source={item.avatarUrl} initials={initials} size="lg" />
                    {item.unreadCount && item.unreadCount > 0 && (
                        <View style={styles.unreadBadgeOnAvatar}>
                            <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.chatContent}>
                    <View style={styles.chatHeader}>
                        <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
                        <Text style={[styles.chatTime, item.unreadCount ? styles.chatTimeUnread : null]}>
                            {item.time}
                        </Text>
                    </View>
                    <View style={styles.chatMessageRow}>
                        <Text style={styles.chatMessage} numberOfLines={1}>{item.message}</Text>
                        {item.isRead && (
                            <Ionicons name="checkmark-done" size={16} color={colors.primary} style={styles.readReceipt} />
                        )}
                        {item.unreadCount && item.unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }, [handleChatPress]);

    return (
        <ScreenContainer padded={false} edges={['top']}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>Gossip.</Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.addButton}>
                            <Ionicons name="add" size={22} color={colors.white} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bellButton}>
                            <Ionicons name="notifications-outline" size={22} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Stories Section */}
                <View style={styles.storiesCard}>
                    <View style={styles.storiesHeader}>
                        <Text style={styles.storiesTitle}>All Story</Text>
                        <TouchableOpacity>
                            <Ionicons name="ellipsis-horizontal" size={18} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.storiesScroll}
                    >
                        {/* Add Story button */}
                        <View style={styles.storyItem}>
                            <View style={styles.addStoryButton}>
                                <Ionicons name="add" size={24} color={colors.white} />
                            </View>
                            <Text style={styles.storyName}>Add Story</Text>
                        </View>
                        {stories.map((story) => (
                            <View key={story.id} style={styles.storyItem}>
                                <Avatar
                                    source={story.avatarUrl}
                                    initials={story.name?.charAt(0)}
                                    size="lg"
                                    style={styles.storyAvatar}
                                />
                                <View style={styles.storyNameContainer}>
                                    <Text style={styles.storyName} numberOfLines={1}>{story.name}</Text>
                                    {story.verified && (
                                        <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                                    )}
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                        <Ionicons name="search" size={18} color={colors.textMuted} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Select or search for recent chats..."
                            placeholderTextColor={colors.textMuted}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterButton}>
                        <Ionicons name="options" size={20} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Filter Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContainer}
                >
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter.id}
                            style={[
                                styles.filterChip,
                                activeFilter === filter.id && styles.filterChipActive
                            ]}
                            onPress={() => setActiveFilter(filter.id)}
                        >
                            <Text style={[
                                styles.filterChipText,
                                activeFilter === filter.id && styles.filterChipTextActive
                            ]}>
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Pinned Chats Section - Only show if there are pinned chats */}
                {pinnedChats.length > 0 && (
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <Ionicons name="pin" size={14} color={colors.textPrimary} />
                                <Text style={styles.sectionTitle}>Pinned Chats</Text>
                                <View style={styles.sectionBadge}>
                                    <Text style={styles.sectionBadgeText}>{pinnedChats.length}</Text>
                                </View>
                            </View>
                            <TouchableOpacity>
                                <Ionicons name="ellipsis-horizontal" size={18} color={colors.textMuted} />
                            </TouchableOpacity>
                        </View>
                        {pinnedChats.map(renderChatItem)}
                    </View>
                )}

                {/* All Chats Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <Text style={styles.sectionTitle}>All Chats</Text>
                            <View style={styles.sectionBadge}>
                                <Text style={styles.sectionBadgeText}>{regularChats.length}</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="ellipsis-horizontal" size={18} color={colors.textMuted} />
                        </TouchableOpacity>
                    </View>
                    {regularChats.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
                            <Text style={styles.emptyStateTitle}>No chats yet</Text>
                            <Text style={styles.emptyStateText}>Start a conversation with someone</Text>
                        </View>
                    ) : (
                        regularChats.map(renderChatItem)
                    )}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Tab Bar */}
            <View style={styles.bottomTabBar}>
                <TouchableOpacity style={styles.tabItemActive}>
                    <View style={styles.activeTabBackground}>
                        <Ionicons name="chatbubbles" size={20} color={colors.white} />
                        <Text style={styles.activeTabText}>Chats</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="call-outline" size={22} color={colors.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="radio-button-on-outline" size={22} color={colors.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(app)/profile' as any)}>
                    <Ionicons name="settings-outline" size={22} color={colors.textMuted} />
                </TouchableOpacity>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F4FD',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.lg,
    },
    logo: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    addButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.sm,
        backgroundColor: colors.primary,
    },
    bellButton: {
        width: 40,
        height: 40,
        borderRadius: radius.full,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.borderLight,
    },

    // Stories
    storiesCard: {
        marginHorizontal: spacing.lg,
        borderRadius: radius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        backgroundColor: colors.primary,
    },
    storiesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    storiesTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.white,
    },
    storiesScroll: {
        paddingRight: spacing.md,
    },
    storyItem: {
        alignItems: 'center',
        marginRight: spacing.md,
        width: 60,
    },
    addStoryButton: {
        width: 52,
        height: 52,
        borderRadius: radius.full,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        borderStyle: 'dashed',
    },
    storyAvatar: {
        borderWidth: 2,
        borderColor: colors.white,
    },
    storyNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
        gap: 2,
    },
    storyName: {
        fontSize: 11,
        color: colors.white,
        textAlign: 'center',
    },

    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: colors.textPrimary,
    },
    filterButton: {
        width: 44,
        height: 44,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.borderLight,
    },

    // Filters
    filtersContainer: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.borderLight,
        marginRight: spacing.sm,
    },
    filterChipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterChipText: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    filterChipTextActive: {
        color: colors.white,
    },

    // Sections
    sectionContainer: {
        backgroundColor: colors.surface,
        marginHorizontal: spacing.lg,
        borderRadius: radius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    sectionBadge: {
        backgroundColor: colors.primarySoft,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    sectionBadgeText: {
        fontSize: 11,
        color: colors.primary,
        fontWeight: '600',
    },

    // Chat Items
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    avatarContainer: {
        position: 'relative',
    },
    unreadBadgeOnAvatar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: colors.primary,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.surface,
    },
    chatContent: {
        flex: 1,
        marginLeft: spacing.md,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chatName: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: colors.textPrimary,
        marginRight: spacing.sm,
    },
    chatTime: {
        fontSize: 12,
        color: colors.textMuted,
    },
    chatTimeUnread: {
        color: colors.primary,
        fontWeight: '600',
    },
    chatMessageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    chatMessage: {
        flex: 1,
        fontSize: 13,
        color: colors.textSecondary,
    },
    readReceipt: {
        marginLeft: spacing.xs,
    },
    unreadBadge: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: spacing.xs,
    },
    unreadBadgeText: {
        fontSize: 11,
        color: colors.white,
        fontWeight: '600',
    },

    // Empty State
    emptyState: {
        paddingVertical: spacing.xl,
        alignItems: 'center',
    },
    emptyStateTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginTop: spacing.md,
    },
    emptyStateText: {
        fontSize: 14,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },

    // Bottom Tab Bar
    bottomTabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingBottom: spacing.xl,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.sm,
    },
    tabItemActive: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTabBackground: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: radius.full,
        gap: spacing.xs,
    },
    activeTabText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.white,
    },
});
