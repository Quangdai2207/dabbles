import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const searchUsersService = async (
  username: string,
  token: string | null | undefined
): Promise<TResponseStatusObject<TSearchUser[]>> => {
  const headers = token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {}
  return handleApiService(http.get(`${ApiBeUrls.user.searchUsers}/${username}`, { headers }), 'Search users failed')
}

export default searchUsersService
