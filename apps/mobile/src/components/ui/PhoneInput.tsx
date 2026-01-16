import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
    Modal,
    FlatList,
    Pressable,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';

interface Country {
    code: string;
    name: string;
    dialCode: string;
    flag: string;
}

const COUNTRIES: Country[] = [
    { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
    { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
    { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
    { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
    { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
    { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
];

interface PhoneInputProps {
    value: string;
    onChangeText: (text: string) => void;
    countryCode: string;
    onCountryChange: (country: Country) => void;
    error?: string;
    containerStyle?: ViewStyle;
}

/**
 * Phone Input Component
 * Country selector with flag + dial code on left
 * Phone number input on right
 */
export function PhoneInput({
    value,
    onChangeText,
    countryCode,
    onCountryChange,
    error,
    containerStyle,
}: PhoneInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

    const selectedCountry = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];

    const getBorderColor = () => {
        if (error) return colors.error;
        if (isFocused) return colors.primary;
        return colors.border;
    };

    const handleCountrySelect = (country: Country) => {
        onCountryChange(country);
        setShowPicker(false);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <View style={[styles.inputWrapper, { borderColor: getBorderColor() }]}>
                {/* Country Selector */}
                <TouchableOpacity
                    style={styles.countrySelector}
                    onPress={() => setShowPicker(true)}
                >
                    <Text style={styles.flag}>{selectedCountry.flag}</Text>
                    <Text style={styles.chevron}>▼</Text>
                    <Text style={styles.dialCode}>{selectedCountry.dialCode}</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Phone Input */}
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder="Phone number"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="phone-pad"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            {/* Country Picker Modal */}
            <Modal
                visible={showPicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPicker(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowPicker(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Country</Text>
                            <TouchableOpacity onPress={() => setShowPicker(false)}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={COUNTRIES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.countryItem,
                                        item.code === countryCode && styles.selectedCountry,
                                    ]}
                                    onPress={() => handleCountrySelect(item)}
                                >
                                    <Text style={styles.countryFlag}>{item.flag}</Text>
                                    <Text style={styles.countryName}>{item.name}</Text>
                                    <Text style={styles.countryDialCode}>{item.dialCode}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderRadius: borderRadius.sm,
        overflow: 'hidden',
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    flag: {
        fontSize: 20,
        marginRight: spacing.xs,
    },
    chevron: {
        fontSize: 8,
        color: colors.textMuted,
        marginRight: spacing.xs,
    },
    dialCode: {
        ...typography.body,
        color: colors.text,
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: colors.border,
    },
    input: {
        flex: 1,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        ...typography.body,
        color: colors.text,
    },
    error: {
        ...typography.caption,
        color: colors.error,
        marginTop: spacing.xs,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        maxHeight: '60%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    modalTitle: {
        ...typography.title,
        color: colors.text,
    },
    closeButton: {
        fontSize: 20,
        color: colors.textMuted,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    selectedCountry: {
        backgroundColor: colors.primarySoft,
    },
    countryFlag: {
        fontSize: 24,
        marginRight: spacing.md,
    },
    countryName: {
        ...typography.body,
        color: colors.text,
        flex: 1,
    },
    countryDialCode: {
        ...typography.body,
        color: colors.textSecondary,
    },
});
