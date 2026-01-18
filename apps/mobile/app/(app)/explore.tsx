import { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { UserCard, Icon, GradientBackground } from '../../src/components/ui';
import { useUsers, useRecentSearches, type SearchUser } from '../../src/hooks';
import { colors, spacing, borderRadius, typography } from '../../src/theme';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * New Connect Screen
 * Pixel-perfect replication of "New Connect" design
 */
export default function NewConnectScreen() {
    const router = useRouter();

    // Data Hooks
    const { loading: searchLoading, users, searchUsers, clearUsers } = useUsers();
    const {
        recentSearches,
        addRecentSearch,
        removeRecentSearch
    } = useRecentSearches();

    // Local State
    const [query, setQuery] = useState('');

    // Search Logic
    const handleSearch = useCallback((text: string) => {
        setQuery(text);
        if (text.trim().length > 1) {
            searchUsers(text.trim());
        } else {
            clearUsers();
        }
    }, [searchUsers, clearUsers]);

    // Navigation & Actions
    const handleUserPress = useCallback((userId: string) => {
        addRecentSearch(userId);
        router.push(`/(app)/profile/${userId}`);
    }, [router, addRecentSearch]);

    const handleRecentSearchPress = useCallback((userId: string) => {
        router.push(`/(app)/profile/${userId}`);
    }, [router]);

    const handleNewGroup = () => {
        // TODO: Implement group creation
        console.log('New group pressed');
    };

    const handleNewCommunity = () => {
        // TODO: Implement community creation
        console.log('New community pressed');
    };

    // Render Components
    const renderRecentSearchItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.recentItem}
            onPress={() => handleRecentSearchPress(item.searchedUser.id)}
            activeOpacity={0.7}
        >
            <View style={styles.recentAvatarContainer}>
                {/* Placeholder avatar logic - simplified for now */}
                <LinearGradient
                    colors={['#E5E7EB', '#D1D5DB']}
                    style={styles.avatarPlaceholder}
                >
                    <Text style={styles.avatarInitial}>
                        {item.searchedUser.displayName?.[0]?.toUpperCase() || '?'}
                    </Text>
                </LinearGradient>
            </View>
            <View style={styles.recentInfo}>
                <Text style={styles.recentName}>
                    {item.searchedUser.displayName}
                </Text>
                <Text style={styles.recentBio} numberOfLines={1}>
                    @{item.searchedUser.username}
                </Text>
            </View>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => removeRecentSearch(item.searchedUser.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Icon name="close" size={14} color={colors.textMuted} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderSearchResult = ({ item }: { item: SearchUser }) => (
        <UserCard
            {...item}
            relationship={item.relationship}
            onPress={() => handleUserPress(item.id)}
            // Hiding action buttons in search results as per design reference
            // They can manage relationship on profile page
            onFollowAction={() => { }}
        />
    );

    // Dynamic Content
    const isSearching = query.trim().length > 1;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* 2. Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Icon name="chevron-back" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New connect</Text>
                <View style={styles.headerRight} />
            </View>

            {/* 3. Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Icon name="search" size={18} color={colors.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        placeholderTextColor={colors.textMuted}
                        value={query}
                        onChangeText={handleSearch}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>
            </View>

            {/* Content Switcher */}
            {isSearching ? (
                // Search Results
                <FlatList
                    data={users}
                    renderItem={renderSearchResult}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={
                        !searchLoading ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No users found</Text>
                            </View>
                        ) : null
                    }
                />
            ) : (
                // Default View: Quick Actions + Recent Searches
                <FlatList
                    data={recentSearches}
                    renderItem={renderRecentSearchItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    keyboardShouldPersistTaps="handled"
                    ListHeaderComponent={
                        <View>
                            {/* 4. Quick Action Items */}
                            <TouchableOpacity style={styles.actionItem} onPress={handleNewGroup}>
                                <LinearGradient
                                    colors={['#49AAFF', '#188BEF']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    style={styles.actionIcon}
                                >
                                    <Icon name="people" size={20} color={colors.white} />
                                </LinearGradient>
                                <Text style={styles.actionLabel}>New Group</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.actionItem, styles.actionItemSpacing]} onPress={handleNewCommunity}>
                                <LinearGradient
                                    colors={['#49AAFF', '#188BEF']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    style={styles.actionIcon}
                                >
                                    <Icon name="globe" size={20} color={colors.white} />
                                </LinearGradient>
                                <Text style={styles.actionLabel}>New Community</Text>
                            </TouchableOpacity>

                            {/* 5. Section Title */}
                            {recentSearches.length > 0 && (
                                <Text style={styles.sectionTitle}>Recent Searches</Text>
                            )}
                        </View>
                    }
                />
            )}
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
    },
    backButton: {
        paddingRight: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        textAlign: 'center',
    },
    headerRight: {
        width: 22, // Balance back button width approx
    },

    // Search
    searchContainer: {
        paddingHorizontal: 16,
        marginTop: 12,
        marginBottom: 16,
    },
    searchBar: {
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F2F3F5',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 15,
        color: colors.text,
        height: '100%',
    },

    // Quick Actions
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 48,
    },
    actionItemSpacing: {
        marginTop: 8,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        overflow: 'hidden', // Ensure gradient respects borderRadius
    },
    actionLabel: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '400',
    },

    // Recent Searches
    sectionTitle: {
        marginTop: 24,
        marginBottom: 8,
        paddingHorizontal: 16,
        fontSize: 14,
        fontWeight: '500',
        color: colors.textMuted,
    },
    listContent: {
        paddingBottom: 24,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        paddingHorizontal: 16,
    },
    recentAvatarContainer: {
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
    recentInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    recentName: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 2,
    },
    recentBio: {
        fontSize: 13,
        color: colors.textMuted,
    },
    closeButton: {
        padding: 4,
    },

    // Empty States
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 15,
        color: colors.textMuted,
    },
});

