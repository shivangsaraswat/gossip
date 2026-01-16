/**
 * Gossip Design System
 * Clean, minimal, premium - Light theme
 * Based on locked Figma design specifications
 */

export const colors = {
    // Primary
    primary: '#49AAFF',
    primarySoft: '#D2E8FC',
    primaryDark: '#2D608B',

    // Backgrounds
    background: '#F9FBFD',
    surface: '#FFFFFF',
    surfaceLight: '#F5F8FA',

    // Text
    text: '#101010',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',

    // Semantic
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',

    // Borders
    border: '#D4D4D8',
    borderLight: '#E5E7EB',

    // Other
    white: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
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
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
};

export const typography = {
    // Display - Screen titles (bold, large)
    display: {
        fontSize: 28,
        fontWeight: '700' as const,
        lineHeight: 34,
        fontFamily: 'System', // Will use Helvetica Neue on iOS
    },
    // Title - Section headers
    title: {
        fontSize: 22,
        fontWeight: '600' as const,
        lineHeight: 28,
        fontFamily: 'System',
    },
    // H1 - Legacy support
    h1: {
        fontSize: 28,
        fontWeight: '700' as const,
        lineHeight: 34,
        fontFamily: 'System',
    },
    // H2 - Secondary headers
    h2: {
        fontSize: 22,
        fontWeight: '600' as const,
        lineHeight: 28,
        fontFamily: 'System',
    },
    // H3 - Tertiary headers
    h3: {
        fontSize: 18,
        fontWeight: '500' as const,
        lineHeight: 24,
        fontFamily: 'System',
    },
    // Body - Regular text
    body: {
        fontSize: 15,
        fontWeight: '400' as const,
        lineHeight: 22,
        fontFamily: 'System',
    },
    // Body small - Secondary body text
    bodySmall: {
        fontSize: 13,
        fontWeight: '400' as const,
        lineHeight: 18,
        fontFamily: 'System',
    },
    // Caption - Meta information
    caption: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
        fontFamily: 'System',
    },
    // Button text
    button: {
        fontSize: 16,
        fontWeight: '600' as const,
        lineHeight: 24,
        fontFamily: 'System',
    },
};

export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
};
