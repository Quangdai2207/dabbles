import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const updateCategoriesForUserService = async (
  token: string | null | undefined,
  categoryIds: string[]
): Promise<TResponseStatusObject<TUserProfile>> => {
  const headers = token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {}
  return handleApiService(
    http.put(`${ApiBeUrls.user.updateCategoriesForUser}`, { categoryIds }, { headers }),
    'Update categories for user failed'
  )
}

export default updateCategoriesForUserService
