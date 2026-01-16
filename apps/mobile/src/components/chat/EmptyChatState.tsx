import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '../ui';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface EmptyChatStateProps {
    onExplorePress: () => void;
}

const { width } = Dimensions.get('window');

/**
 * Empty Chat State Component
 * Shows illustration and Explore CTA
 * Updates:
 * - Reduced Button Padding (Vertical height)
 * - Tweak spacing between elements
 * - Precision Text Wrapping
 */
export function EmptyChatState({ onExplorePress }: EmptyChatStateProps) {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/empty-screen-mockup.png')}
                style={styles.illustration}
                resizeMode="contain"
            />

            <View style={styles.textContainer}>
                <Text style={styles.message}>
                    You don't have any contacts in your following list to communicate with. Please search and explore to start a conversation.
                </Text>
            </View>

            <TouchableOpacity
                onPress={onExplorePress}
                activeOpacity={0.8}
                style={styles.buttonWrapper}
            >
                <LinearGradient
                    colors={['#49AAFF', '#188BEF']} // Vertical Gradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.button}
                >
                    <Icon name="add" size={20} color={colors.white} strokeWidth={2.5} />
                    <Text style={styles.buttonText}>Explore</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
        paddingBottom: 60, // Adjusted visual center padding
    },
    illustration: {
        width: 250,
        height: 160,
        marginBottom: 24, // Specific gap Image -> Text
    },
    textContainer: {
        paddingHorizontal: 32, // More constraint for text wrapping
        marginBottom: 40, // Specific gap Text -> Button
    },
    message: {
        ...typography.body,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
        fontSize: 13,
    },
    buttonWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        paddingVertical: 12, // Reduced height (was 14)
        borderRadius: borderRadius.full,
        gap: 8,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        ...typography.button,
        color: colors.white,
        fontWeight: '600',
        fontSize: 16,
    },
});
