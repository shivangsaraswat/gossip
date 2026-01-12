import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '../../theme';

interface AppHeaderProps {
    /** Header title text */
    title?: string;
    /** Show back button (default: false) */
    showBack?: boolean;
    /** Custom left element (overrides back button) */
    leftElement?: ReactNode;
    /** Right action icons/buttons */
    rightElement?: ReactNode;
    /** Callback for back button press */
    onBackPress?: () => void;
}

/**
 * AppHeader
 * WhatsApp-like sticky header:
 * - Left: title text or back button
 * - Right: optional action icons
 * - Fixed height: 56px
 */
export function AppHeader({
    title,
    showBack = false,
    leftElement,
    rightElement,
    onBackPress,
}: AppHeaderProps) {
    const router = useRouter();

    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            router.back();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                {leftElement ? (
                    leftElement
                ) : showBack ? (
                    <TouchableOpacity
                        onPress={handleBack}
                        style={styles.backButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                ) : null}
                {title && (
                    <Text style={[styles.title, showBack && styles.titleWithBack]}>
                        {title}
                    </Text>
                )}
            </View>
            {rightElement && <View style={styles.rightSection}>{rightElement}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        backgroundColor: colors.background,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    backButton: {
        marginRight: spacing.sm,
        padding: spacing.xs,
    },
    backIcon: {
        fontSize: 24,
        color: colors.primary,
    },
    title: {
        ...typography.styles.section,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    titleWithBack: {
        marginLeft: spacing.xs,
    },
});
