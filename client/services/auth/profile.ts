import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'
import logoutService from './logout'

export const profileService = async (auth_token: string): Promise<TResponseStatusObject<TProfile>> => {
  const headers = {
    Authorization: `Bearer ${auth_token}`
  }
  const result = await handleApiService<TResponseStatusObject<TProfile>>(
    http.get<TResponseStatusObject<TProfile>>(ApiBeUrls.auth.profile, { headers }),
    'Get profile failed'
  )

  if (!result.isSuccess) {
    await logoutService(auth_token)
  }
  return result
}
