import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '../ui';
import { colors, spacing, typography, borderRadius } from '../../theme';

type FilterType = 'all' | 'unread' | 'groups';

interface FilterChipsProps {
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    counts: {
        all: number;
        unread: number;
        groups: number;
    };
}

interface ChipProps {
    label: string;
    count?: number;
    isActive: boolean;
    onPress: () => void;
    showCheckmark?: boolean;
}

function Chip({ label, count, isActive, onPress, showCheckmark }: ChipProps) {
    // Active Color Logic: #114A7B for All and generally for active state per user request for consistency
    const activeColors = ['#114A7B', '#114A7B'] as const;

    const content = (
        <View style={styles.chipContent}>
            {showCheckmark && isActive && (
                <View style={styles.checkmarkContainer}>
                    <Icon
                        name="checkmark"
                        size={10} // Reduced size
                        color={colors.white}
                        strokeWidth={3}
                    />
                </View>
            )}
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {label}
            </Text>
            {/* Show badge if count is defined, even for 0 */}
            {count !== undefined && (
                <View style={[styles.countBadge, isActive && styles.countBadgeActiveFromSolid]}>
                    <Text style={[styles.countText, isActive && styles.countTextActive]}>
                        {count}
                    </Text>
                </View>
            )}
        </View>
    );

    if (isActive) {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={activeColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }} // Vertical
                    style={[styles.chip, styles.chipActiveBorder]}
                >
                    {content}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={styles.chip}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {content}
        </TouchableOpacity>
    );
}

/**
 * Filter Chips Component
 * Horizontal scrollable row of filter options
 * Updates:
 * - Extremely compact layout to ensure '+' button visibility
 * - Reduced font sizes, paddings, and gaps
 */
export function FilterChips({
    activeFilter,
    onFilterChange,
    counts,
}: FilterChipsProps) {
    return (
        <View style={styles.wrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                <Chip
                    label="All"
                    isActive={activeFilter === 'all'}
                    onPress={() => onFilterChange('all')}
                    showCheckmark
                />
                <Chip
                    label="Unread Chats"
                    count={counts.unread}
                    isActive={activeFilter === 'unread'}
                    onPress={() => onFilterChange('unread')}
                />
                <Chip
                    label="Group Chats" // Slightly shorter text might be needed if still overflowing? No, user said layout.
                    count={counts.groups}
                    isActive={activeFilter === 'groups'}
                    onPress={() => onFilterChange('groups')}
                />
                <TouchableOpacity style={styles.addChip} activeOpacity={0.7}>
                    <Icon name="add" size={18} color={colors.text} />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        height: 40, // Reduced container height slightly
    },
    container: {
        paddingHorizontal: 16,
        gap: 6, // Reduced gap (was 8)
        alignItems: 'center',
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: borderRadius.md,
        height: 32, // Reduced height (was 36)
        overflow: 'hidden',
        minWidth: 0,
    },
    chipActiveBorder: {
        backgroundColor: 'transparent',
    },
    chipContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10, // Reduced padding (was 12)
        height: '100%',
    },
    checkmarkContainer: {
        marginRight: 4,
    },
    chipText: {
        fontSize: 13, // Reduced font size (was 14)
        color: colors.text,
        fontWeight: '500',
    },
    chipTextActive: {
        color: colors.white,
    },
    countBadge: {
        marginLeft: 4, // Reduced margin
        backgroundColor: '#49AAFF',
        borderRadius: borderRadius.full,
        paddingHorizontal: 5, // Tighter padding
        paddingVertical: 1,
        minWidth: 16, // Smaller min width
        alignItems: 'center',
        justifyContent: 'center',
    },
    countBadgeActiveFromSolid: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    countText: {
        fontSize: 10, // Reduced font
        color: colors.white,
        fontWeight: '600',
    },
    countTextActive: {
        color: colors.white,
    },
    addChip: {
        width: 32, // Match chip height
        height: 32,
        borderRadius: borderRadius.md,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
