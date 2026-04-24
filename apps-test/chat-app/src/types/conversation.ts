// 1. Enum cho loại hội thoại
export const ConversationType = {
    PRIVATE: "PRIVATE",
    GROUP: "GROUP",
} as const;

export type ConversationType =
    (typeof ConversationType)[keyof typeof ConversationType];

// 2. Request tạo hội thoại
export interface CreateConversationRequest {
    userEmails: string[];
    type: ConversationType;
    name?: string;
}

// 3. Response hội thoại (Dùng cho danh sách)
export interface UserSummaryDto {
    id: string;
    name: string;
    avatar: string;
}

export interface ConversationResponseDto {
    id: string;
    name: string;
    type: string;
    avatar: string;
    lastMessageAt: string;
    participants: UserSummaryDto[];
    unreadMessageCount: number;
}

// 4. DTO Tin nhắn
export interface MessageResponseDto {
    id: string;
    content: string;
    messageType: string;
    attachmentUrl?: string;
    createdDate: string;
    conversationId: string;
    sender: UserSummaryDto;
}
