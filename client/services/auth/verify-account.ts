import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const verifyAccountService = async (token: string): Promise<TResponseStatus> => {
  return handleApiService(http.post(ApiBeUrls.auth.verifyAccount, { token }), 'Verify account failed')
}

export default verifyAccountService
