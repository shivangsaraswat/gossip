/**
 * Gossip Typography Scale
 * Font sizes per design spec
 */

export const typography = {
    // Sizes per spec
    title: 22,
    section: 18,
    body: 15,
    meta: 12,

    // Legacy style aliases
    text: {
        fontSize: 15,
        fontWeight: '400' as const,
        lineHeight: 22,
    },

    // Full text styles for convenience
    styles: {
        title: {
            fontSize: 22,
            fontWeight: '700' as const,
            lineHeight: 28,
        },
        section: {
            fontSize: 18,
            fontWeight: '600' as const,
            lineHeight: 24,
        },
        body: {
            fontSize: 15,
            fontWeight: '400' as const,
            lineHeight: 22,
        },
        bodyMedium: {
            fontSize: 15,
            fontWeight: '500' as const,
            lineHeight: 22,
        },
        meta: {
            fontSize: 12,
            fontWeight: '400' as const,
            lineHeight: 16,
        },
    },
    // Compatibility aliases
    h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
    h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
    bodySmall: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
    caption: { fontSize: 11, fontWeight: '400' as const, lineHeight: 14 },
} as const;

export type TypographyKey = keyof typeof typography;
