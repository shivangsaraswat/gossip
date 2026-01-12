import { z } from 'zod';

export const sendFollowRequestSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
});

export const acceptFollowRequestSchema = z.object({
    requestId: z.string().min(1, 'Request ID is required'),
});

export const rejectFollowRequestSchema = z.object({
    requestId: z.string().min(1, 'Request ID is required'),
});

export const unfollowSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
});

// Type exports
export type SendFollowRequestInput = z.infer<typeof sendFollowRequestSchema>;
export type AcceptFollowRequestInput = z.infer<typeof acceptFollowRequestSchema>;
export type RejectFollowRequestInput = z.infer<typeof rejectFollowRequestSchema>;
export type UnfollowInput = z.infer<typeof unfollowSchema>;
