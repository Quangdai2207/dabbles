import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const addCategoriesForUserService = async (
  token: string | null | undefined,
  categoryIds: string[]
): Promise<TResponseStatusObject<TUserProfile>> => {
  const headers = token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {}
  return handleApiService(
    http.post(`${ApiBeUrls.user.addCategoriesForUser}`, { categoryIds }, { headers }),
    'Add categories for user failed'
  )
}

export default addCategoriesForUserService
