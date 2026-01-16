import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Icon } from '../ui';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

/**
 * Search Bar Component
 * Full-width rounded search input
 * Pixel-perfect match with Figma
 */
export function SearchBar({
    value,
    onChangeText,
    placeholder = 'Search',
}: SearchBarProps) {
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Icon
                    name="search"
                    size={20}
                    color={colors.textMuted}
                    style={styles.icon}
                />
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6', // Lighter gray for search bar to match Figma
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        height: 44, // Fixed height for consistency
    },
    icon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        ...typography.body,
        color: colors.text,
        padding: 0,
        height: '100%',
    },
});
