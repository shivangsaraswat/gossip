/**
 * Gossip Design System
 * Clean, minimal, intentional
 */

export const colors = {
    // Primary
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    primaryLight: '#818CF8',

    // Backgrounds
    background: '#000000',
    surface: '#111111',
    surfaceLight: '#1A1A1A',

    // Text
    text: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textMuted: '#52525B',

    // Semantic
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',

    // Borders
    border: '#27272A',
    borderLight: '#3F3F46',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
};

export const typography = {
    h1: {
        fontSize: 32,
        fontWeight: '700' as const,
        lineHeight: 40,
    },
    h2: {
        fontSize: 24,
        fontWeight: '600' as const,
        lineHeight: 32,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24,
    },
    bodySmall: {
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
    },
    caption: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
    },
};
