import { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GradientBackground } from '../../../src/components/ui';
import {
    ChatHeader,
    SearchBar,
    FilterChips,
    StoryRow,
    SectionHeader,
    ChatListItem,
    EmptyChatState,
} from '../../../src/components/chat';
import { colors, spacing } from '../../../src/theme';
import type { Chat, Story, ChatListState } from '../../../src/types';

/**
 * Main Chat List Screen
 * Landing screen after authentication
 * 
 * State-driven UI:
 * - loading: Show skeleton/spinner
 * - emptyChats: Show empty illustration + Explore CTA
 * - hasChats: Show chat list (no stories)
 * - hasChatsWithStories: Show story row + chat list
 */
export default function ChatsScreen() {
    const router = useRouter();

    // UI State - would be derived from data in production
    // Currently empty for initial implementation
    const [chats] = useState<Chat[]>([]);
    const [stories] = useState<Story[]>([]);
    const [isLoading] = useState(false);
    const [storiesHidden, setStoriesHidden] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'groups'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Derive UI state from data
    const uiState: ChatListState = useMemo(() => {
        if (isLoading) return 'loading';
        if (chats.length === 0) return 'emptyChats';
        if (stories.length > 0 && !storiesHidden) return 'hasChatsWithStories';
        return 'hasChats';
    }, [isLoading, chats.length, stories.length, storiesHidden]);

    // Filter counts (derived from data)
    const filterCounts = useMemo(() => ({
        all: chats.length,
        unread: chats.filter(c => c.lastMessage && !c.lastMessage.isRead).length,
        groups: 0, // No group chats yet
    }), [chats]);

    // Navigation handlers
    const handleExplorePress = () => {
        router.push('/(app)/explore');
    };

    const handleChatPress = (chatId: string) => {
        // TODO: Navigate to chat conversation
        console.log('Navigate to chat:', chatId);
    };

    const handleAddPress = () => {
        router.push('/(app)/explore');
    };

    const handleNotificationPress = () => {
        router.push('/(app)/notifications');
    };

    const handleToggleStories = () => {
        setStoriesHidden((prev) => !prev);
    };

    // Render chat item
    const renderChatItem = ({ item }: { item: Chat }) => (
        <ChatListItem
            chat={item}
            onPress={() => handleChatPress(item.id)}
        />
    );

    // Render loading state
    if (uiState === 'loading') {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.container} edges={['top']}>
                    <ChatHeader
                        onAddPress={handleAddPress}
                        onNotificationPress={handleNotificationPress}
                    />
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // Render empty state
    if (uiState === 'emptyChats') {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.container} edges={['top']}>
                    <ChatHeader
                        onAddPress={handleAddPress}
                        onNotificationPress={handleNotificationPress}
                    />
                    <SearchBar
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search"
                    />
                    <FilterChips
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        counts={filterCounts}
                    />
                    <SectionHeader
                        title="All Chats"
                        count={0}
                        onMenuPress={handleToggleStories}
                    />
                    <EmptyChatState onExplorePress={handleExplorePress} />
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // Render chat list (with or without stories)
    return (
        <GradientBackground>
            <SafeAreaView style={styles.container} edges={['top']}>
                <ChatHeader
                    onAddPress={handleAddPress}
                    onNotificationPress={handleNotificationPress}
                    showSearch={uiState === 'hasChatsWithStories'}
                />
                {uiState === 'hasChatsWithStories' ? null : (
                    <SearchBar
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search"
                    />
                )}
                {uiState === 'hasChatsWithStories' && (
                    <StoryRow stories={stories} />
                )}
                <FilterChips
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    counts={filterCounts}
                />
                <SectionHeader
                    title="All Chats"
                    count={chats.length}
                    onMenuPress={handleToggleStories}
                />
                <FlatList
                    data={chats}
                    renderItem={renderChatItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxl,
    },
});
