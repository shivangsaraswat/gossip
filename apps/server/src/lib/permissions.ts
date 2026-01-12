import prisma from './prisma.js';

/**
 * Relationship status between two users (derived, never stored)
 */
export type RelationshipStatus =
    | 'not_following'
    | 'request_sent'
    | 'request_received'
    | 'following'
    | 'mutual';

/**
 * Get the relationship status between current user and target user
 * This is the core derivation function - computes state from follow tables
 */
export async function getRelationshipStatus(
    currentUserId: string,
    targetUserId: string
): Promise<RelationshipStatus> {
    // Check if current user follows target
    const currentFollowsTarget = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: currentUserId,
                followingId: targetUserId,
            },
        },
    });

    // Check if target follows current user
    const targetFollowsCurrent = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: targetUserId,
                followingId: currentUserId,
            },
        },
    });

    // Mutual follow
    if (currentFollowsTarget && targetFollowsCurrent) {
        return 'mutual';
    }

    // One-way follows
    if (currentFollowsTarget) {
        return 'following';
    }

    if (targetFollowsCurrent) {
        // Target follows us but we don't follow them
        // From our perspective, they're following us
        return 'following';
    }

    // Check pending requests
    const sentRequest = await prisma.followRequest.findUnique({
        where: {
            senderId_receiverId: {
                senderId: currentUserId,
                receiverId: targetUserId,
            },
        },
    });

    if (sentRequest) {
        return 'request_sent';
    }

    const receivedRequest = await prisma.followRequest.findUnique({
        where: {
            senderId_receiverId: {
                senderId: targetUserId,
                receiverId: currentUserId,
            },
        },
    });

    if (receivedRequest) {
        return 'request_received';
    }

    return 'not_following';
}

/**
 * Check if two users can message each other
 * Returns true ONLY if mutual follow exists
 * 
 * This is the single source of truth for messaging permissions
 */
export async function canUsersMessage(
    userAId: string,
    userBId: string
): Promise<boolean> {
    // Check if A follows B
    const aFollowsB = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: userAId,
                followingId: userBId,
            },
        },
    });

    if (!aFollowsB) {
        return false;
    }

    // Check if B follows A
    const bFollowsA = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: userBId,
                followingId: userAId,
            },
        },
    });

    return !!bFollowsA;
}

/**
 * Check if a mutual follow exists (optimized single query version)
 */
export async function hasMutualFollow(
    userAId: string,
    userBId: string
): Promise<boolean> {
    const count = await prisma.follow.count({
        where: {
            OR: [
                { followerId: userAId, followingId: userBId },
                { followerId: userBId, followingId: userAId },
            ],
        },
    });

    return count === 2;
}
