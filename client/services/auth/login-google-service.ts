import ApiBeUrls from '@/constants/api-be-urls'
import ApiNextUrls from '@/constants/api-next-urls'
import http from '@/lib/http-request'
import { handleApiService } from '@/lib/api-service-helper'

export const loginGoogleService = async (idToken: string) => {
  // Step 1: Login to Backend
  const resBe = (await handleApiService(
    http.post(ApiBeUrls.auth.googleLogin, { idToken }),
    'Login failed'
  )) as TResponseStatusAuth

  if (!resBe.isSuccess) {
    return resBe
  }

  // Step 2: Set cookie via Next.js API
  return handleApiService<TResponseStatusAuth>(
    http.post(ApiNextUrls.auth.login, { token: resBe.token }),
    'Login failed'
  )
}
