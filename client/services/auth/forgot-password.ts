import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const forgotPasswordService = async (data: { email: string }): Promise<TResponseStatus> => {
  return handleApiService(http.post(ApiBeUrls.auth.forgotPassword, data), 'Forgot password failed')
}

export default forgotPasswordService
