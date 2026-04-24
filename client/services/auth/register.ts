import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

export const registerService = async (signUpRequest: TSignupRequest): Promise<TResponseStatus> => {
  const { captchaToken, ...payload } = signUpRequest
  const headers = {
    'X-Register-Token': captchaToken
  }
  return handleApiService<TResponseStatus>(
    http.post(ApiBeUrls.auth.register, payload, { headers }),
    'Registration failed'
  )
}
