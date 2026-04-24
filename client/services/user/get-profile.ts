import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const getProfileService = async (
  username: string,
  token: string | null | undefined
): Promise<TResponseStatusObject<TUserProfile>> => {
  const headers = token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {}
  return handleApiService(http.get(`${ApiBeUrls.user.getUserProfile}/${username}`, { headers }), 'Get profile failed')
}

export default getProfileService
