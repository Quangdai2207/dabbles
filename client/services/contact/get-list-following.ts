import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const getListFollowingService = async (
  username: string,
  token: string
): Promise<TResponseStatusObject<TFollowingUser[]>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(
    http.get(`${ApiBeUrls.contact.following}/${username}`, { headers }),
    'Get list following failed'
  )
}

export default getListFollowingService
