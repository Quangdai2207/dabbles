import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const totalUnreadConversationsService = async (token: string): Promise<TResponseStatusObject<number>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(
    http.get(ApiBeUrls.conversation.totalUnreadConversations, { headers }),
    'Get total unread conversations failed'
  )
}

export default totalUnreadConversationsService
