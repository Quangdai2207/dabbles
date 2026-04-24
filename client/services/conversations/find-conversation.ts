import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const findConversationService = async (
  username: string,
  token: string
): Promise<TResponseStatusObject<TFindConversation>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(
    http.get(`${ApiBeUrls.conversation.findConversation}/${username}`, { headers }),
    'Find conversation failed'
  )
}

export default findConversationService
