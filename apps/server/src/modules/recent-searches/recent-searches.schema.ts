import { z } from 'zod';

/**
 * Schema for saving a recent search
 */
export const saveRecentSearchSchema = z.object({
    body: z.object({
        searchedUserId: z.string().min(1, 'searchedUserId is required'),
    }),
});

/**
 * Schema for deleting a recent search
 */
export const deleteRecentSearchSchema = z.object({
    params: z.object({
        searchedUserId: z.string().min(1, 'searchedUserId is required'),
    }),
});

export type SaveRecentSearchInput = z.infer<typeof saveRecentSearchSchema>['body'];
export type DeleteRecentSearchParams = z.infer<typeof deleteRecentSearchSchema>['params'];
