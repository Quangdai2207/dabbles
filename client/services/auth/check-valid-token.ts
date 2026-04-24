import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const checkValidTokenService = async (token: string): Promise<TResponseStatus> => {
  return handleApiService(http.post(ApiBeUrls.auth.checkValidToken, { token }), 'Check valid token failed')
}

export default checkValidTokenService
