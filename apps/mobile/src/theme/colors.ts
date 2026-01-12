/**
 * Gossip Color Palette
 * Light theme per design spec
 */

export const colors = {
    // Primary
    primary: '#49AAFF',
    primarySoft: '#D2E8FC',

    // Text
    textPrimary: '#101010',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',

    // Backgrounds
    background: '#F9FBFD',
    surface: '#FFFFFF',
    surfaceSecondary: '#F3F4F6',

    // Accent
    secondaryDark: '#2D608B',

    // Borders
    border: '#D4D4D8',
    borderLight: '#E5E7EB',

    // Semantic
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',

    // Utility
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',

    // Compatibility aliases
    text: '#101010',
    surfaceLight: '#FFFFFF',
    primaryDark: '#2D608B',
    secondary: '#D2E8FC',
} as const;

export type ColorKey = keyof typeof colors;
