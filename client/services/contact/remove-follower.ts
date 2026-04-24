import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const removeFollowerService = async (token: string, username: string): Promise<TResponseStatus> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(
    http.delete(`${ApiBeUrls.contact.removeFollower}/${username}`, { headers }),
    'Remove follower failed'
  )
}

export default removeFollowerService
