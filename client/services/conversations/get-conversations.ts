import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const getConversationsService = async (
  token: string
): Promise<TResponseStatusObject<TConversationResponseForChatBoxDto[]>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(http.get(ApiBeUrls.conversation.getConversations, { headers }), 'Get conversations failed')
}

export default getConversationsService
