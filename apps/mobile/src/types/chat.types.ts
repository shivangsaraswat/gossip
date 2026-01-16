/**
 * Chat-related types
 * Used for chat list screen and messaging
 */

/**
 * Chat list UI state
 * Derived from data presence, not screen type
 */
export type ChatListState = 'loading' | 'emptyChats' | 'hasChats' | 'hasChatsWithStories';

/**
 * Chat participant info
 */
export interface ChatParticipant {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    isVerified?: boolean;
}

/**
 * Last message in a chat
 */
export interface ChatLastMessage {
    content: string;
    timestamp: string;
    isRead: boolean;
    senderId: string;
}

/**
 * Chat item for the chat list
 */
export interface Chat {
    id: string;
    participant: ChatParticipant;
    lastMessage?: ChatLastMessage;
}

/**
 * Story user info
 */
export interface StoryUser {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    isVerified?: boolean;
}

/**
 * Story item for the story row
 */
export interface Story {
    id: string;
    user: StoryUser;
    hasUnseenStory: boolean;
}
