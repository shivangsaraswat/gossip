import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Icon } from '../ui';

interface ProfileStatusConnectedProps {
    onMessage: () => void;
    onBlock?: () => void;
    onReport?: () => void;
}

export function ProfileStatusConnected({
    onMessage,
    onBlock,
    onReport
}: ProfileStatusConnectedProps) {
    return (
        <View style={styles.container}>
            {/* Action Buttons */}
            <View style={styles.buttonRow}>
                {/* Connected Button - Gradient */}
                <LinearGradient
                    colors={['#49AAFF', '#188BEF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[styles.button, styles.connectedButton]}
                >
                    <Text style={styles.connectedButtonText}>Connected</Text>
                </LinearGradient>

                {/* Message Button - Primary Outline */}
                <TouchableOpacity
                    style={[styles.button, styles.messageButton]}
                    onPress={onMessage}
                    activeOpacity={0.8}
                >
                    <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>

                {/* Audio Icon Button */}
                <TouchableOpacity style={styles.iconButton}>
                    <Icon name="call-outline" size={20} color="#3B82F6" />
                </TouchableOpacity>

                {/* Video Icon Button */}
                <TouchableOpacity style={styles.iconButton}>
                    <Icon name="videocam-outline" size={20} color="#3B82F6" />
                </TouchableOpacity>
            </View>

            {/* Media Section */}
            <View style={styles.mediaSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Media, Links, and docs</Text>
                    <View style={styles.countContainer}>
                        <Text style={styles.countText}>45</Text>
                        <Icon name="chevron-forward" size={16} color={colors.textSecondary} />
                    </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mediaScroll}>
                    {[1, 2, 3, 4].map((i) => (
                        <View key={i} style={styles.mediaItemPlaceholder}>
                            <Icon name="image-outline" size={24} color="#9CA3AF" />
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Controls Section */}
            <View style={styles.controlsSection}>
                <ControlItem icon="notifications-outline" label="Notifications" />
                <ControlItem icon="image-outline" label="Media Visibility" />
                <ControlItem icon="timer-outline" label="Disappearing messages" />

                <View style={styles.divider} />

                <ControlItem
                    icon="ban-outline"
                    label="Block user"
                    textColor="#EF4444"
                    iconColor="#EF4444"
                    onPress={onBlock}
                />
                <ControlItem
                    icon="flag-outline"
                    label="Report user"
                    textColor="#EF4444"
                    iconColor="#EF4444"
                    onPress={onReport}
                />
            </View>
        </View>
    );
}

function ControlItem({
    icon,
    label,
    textColor = colors.text,
    iconColor = colors.text,
    onPress
}: {
    icon: any,
    label: string,
    textColor?: string,
    iconColor?: string,
    onPress?: () => void
}) {
    return (
        <TouchableOpacity style={styles.controlItem} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.controlLeft}>
                <Icon name={icon} size={22} color={iconColor} />
                <Text style={[styles.controlLabel, { color: textColor }]}>{label}</Text>
            </View>
            <Icon name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
        width: '100%',
        marginBottom: 24,
    },
    button: {
        flex: 1, // Grow equally
        height: 44,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: '#BFDBFE', // Light blue border
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EFF6FF', // Light blue bg
    },
    connectedButton: {
        // backgroundColor removed for gradient
        opacity: 1, // Solid as per spec? "Solid blue, disabled"
    },
    connectedButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    messageButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#3B82F6', // Primary blue outline
    },
    messageButtonText: {
        color: '#3B82F6',
        fontSize: 14,
        fontWeight: '600',
    },

    // Media
    mediaSection: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    countContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    countText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    mediaScroll: {
        gap: 8,
    },
    mediaItemPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Controls
    controlsSection: {
        gap: 4,
    },
    controlItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    controlLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    controlLabel: {
        fontSize: 15,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 8,
    },
});
