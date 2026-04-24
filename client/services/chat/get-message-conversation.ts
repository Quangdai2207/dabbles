import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const getMessagesConversation = async (
  conversationId: string,
  token: string,
  cursor: string = ''
): Promise<TResponseStatusObject<TMessageConversation[]>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(
    http.get(`${ApiBeUrls.chat.getMessages}/${conversationId}?cursor=${cursor}`, { headers }),
    'Get messages failed'
  )
}

export default getMessagesConversation
