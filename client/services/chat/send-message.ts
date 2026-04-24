import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const sendMessageConversation = async (
  conversationId: string,
  content: string,
  token: string
): Promise<TResponseStatusObject<TMessageConversation>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  const payload = {
    conversationId,
    content
  }
  return handleApiService(http.post(ApiBeUrls.chat.sendMessage, payload, { headers }), 'Send messages failed')
}

export default sendMessageConversation
