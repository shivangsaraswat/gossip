import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { StoryAvatar } from './StoryAvatar';
import { spacing } from '../../theme';
import type { Story } from '../../types';

interface StoryRowProps {
    stories: Story[];
}

/**
 * Story Row Component
 * Horizontal scrollable list of story avatars
 * First item is always "Add Story"
 */
export function StoryRow({ stories }: StoryRowProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {/* Add Story Button */}
            <StoryAvatar
                username="add"
                isAddButton
            />
            {/* Story Avatars */}
            {stories.map((story) => (
                <StoryAvatar
                    key={story.id}
                    avatarUrl={story.user.avatarUrl}
                    displayName={story.user.displayName}
                    username={story.user.username}
                    isVerified={story.user.isVerified}
                    hasUnseenStory={story.hasUnseenStory}
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        gap: spacing.sm,
    },
});
