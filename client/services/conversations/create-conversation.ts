import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const createConversationsService = async (
  token: string,
  usernames: string[],
  name: string = ''
): Promise<TResponseStatusObject<TCreateConversation>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  const payload = {
    usernames,
    name
  }
  return handleApiService(
    http.post(ApiBeUrls.conversation.createConversation, payload, { headers }),
    'Create conversations failed'
  )
}

export default createConversationsService
