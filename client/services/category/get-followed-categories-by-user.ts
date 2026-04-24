import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const getFollowedCategoriesByUser = async (
  token: string | null | undefined
): Promise<TResponseStatusObject<TCategory[]>> => {
  const headers = token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {}
  return await handleApiService(
    http.get(`${ApiBeUrls.category.getFollowedCategoriesByUser}`, { headers }),
    'Get followed categories by user failed'
  )
}
export default getFollowedCategoriesByUser
