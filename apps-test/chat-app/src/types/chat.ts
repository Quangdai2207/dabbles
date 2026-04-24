// src/types/chat.ts

export interface UserSummaryDto {
    id: string;
    name: string;
    avatar: string;
}

export interface MessageResponseDto {
    id: string;
    content: string;
    messageType: "TEXT";
    attachmentUrl?: string; // Dấu ? nghĩa là có thể null
    createdDate: string; // JSON trả về Date dưới dạng String
    conversationId: string;
    sender: UserSummaryDto;
}

// Interface cho Request gửi đi
export interface SendMessageRequest {
    conversationId: string;
    content: string;
}