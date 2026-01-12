/**
 * Gossip Border Radius Scale
 * Consistent rounded corners
 */

export const radius = {
    sm: 8,
    md: 12,
    lg: 16,
    full: 999,
} as const;

export type RadiusKey = keyof typeof radius;
