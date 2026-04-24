import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const getListFollowerService = async (
  username: string,
  token: string
): Promise<TResponseStatusObject<TFollowerUser[]>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(
    http.get(`${ApiBeUrls.contact.followers}/${username}`, { headers }),
    'Get list follower failed'
  )
}

export default getListFollowerService
