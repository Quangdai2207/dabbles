import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import ApiNextUrls from '@/constants/api-next-urls'
import { handleApiService } from '@/lib/api-service-helper'

const loginService = async (loginRequest: TLoginRequest): Promise<TResponseStatus> => {
  const { captchaToken, ...payload } = loginRequest
  const headers = {
    'X-Captcha-Token': captchaToken
  }

  // Step 1: Login to Backend
  const resBe = await handleApiService<TResponseStatusAuth>(
    http.post(ApiBeUrls.auth.login, payload, { headers }),
    'Login failed'
  )

  if (!resBe.isSuccess) {
    return resBe
  }

  // Step 2: Set cookie via Next.js API
  // ApiNextUrls.auth.login likely returns a generic TResponseStatus or TResponseStatusObject
  return handleApiService<TResponseStatus>(http.post(ApiNextUrls.auth.login, { token: resBe.token }), 'Login failed')
}

export { loginService }
