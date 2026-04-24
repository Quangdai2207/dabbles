import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const deleteMessageConversationService = async (
  token: string,
  conversationId: string
): Promise<TResponseStatusObject<TConversationResponseForChatBoxDto[]>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(
    http.delete(`${ApiBeUrls.conversation.deleteMessageConversation}/${conversationId}`, { headers }),
    'Delete message conversation failed'
  )
}

export default deleteMessageConversationService
