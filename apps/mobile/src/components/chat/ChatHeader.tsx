import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '../ui';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface ChatHeaderProps {
    onAddPress?: () => void;
    onNotificationPress?: () => void;
    showSearch?: boolean;
}

/**
 * Chat Header Component
 * Shows app title "Gossip" with grouped action buttons
 * Specific styling: Vertical Gradient Blue container (R12) with White button (R10) nested inside
 */
export function ChatHeader({
    onAddPress,
    onNotificationPress,
    showSearch = false,
}: ChatHeaderProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gossip</Text>
            <View style={styles.actions}>
                {showSearch && (
                    <TouchableOpacity style={styles.iconButton}>
                        <Icon name="search" size={24} color={colors.text} />
                    </TouchableOpacity>
                )}

                {/* 
                    Grouped Action Buttons (Nested Pill) 
                    Outer: Vertical Gradient Blue Container
                    Inner Right: White Button nested inside
                */}
                <LinearGradient
                    colors={['#49AAFF', '#188BEF']} // Gradient from Figma (Top to Bottom)
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }} // Vertical
                    style={styles.blueContainer}
                >
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={onAddPress}
                        activeOpacity={0.8}
                    >
                        {/* Centered Add Icon in the blue area */}
                        <Icon name="add" size={22} color={colors.white} strokeWidth={2.5} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={onNotificationPress}
                        activeOpacity={0.7}
                    >
                        {/* Notification Icon with Red Dot */}
                        <View>
                            <Icon name="notifications" size={20} color={colors.text} strokeWidth={2} />
                            <View style={styles.redDot} />
                        </View>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
    },
    title: {
        ...typography.display,
        fontSize: 28,
        color: colors.text,
        fontWeight: '700',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    iconButton: {
        padding: spacing.sm,
    },
    blueContainer: {
        flexDirection: 'row',
        borderRadius: 12,           // External Radius: 12
        padding: 3,                 // Padding to create the inset effect
        alignItems: 'center',
        height: 44,                 // Fixed height
        minWidth: 90,               // Ensure enough width for both
    },
    addButton: {
        width: 40,
        height: 38,                 // Match height within padding
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,                    // Take remaining space on left
        marginRight: 2,             // Slight spacing to white button
    },
    notificationButton: {
        width: 40,                  // specific width
        height: 38,                 // Fill height within padding
        backgroundColor: colors.white,
        borderRadius: 10,           // Internal Radius: 10
        justifyContent: 'center',
        alignItems: 'center',
    },
    redDot: {
        position: 'absolute',
        top: 0,
        right: 2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1.5,
        borderColor: colors.white,
    },
});
