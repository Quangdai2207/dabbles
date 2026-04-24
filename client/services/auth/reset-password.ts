import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const resetPasswordService = async (data: {
  token: string
  password: string
  passwordConfirm: string
}): Promise<TResponseStatus> => {
  return handleApiService(http.post(ApiBeUrls.auth.resetPassword, data), 'Reset password failed')
}

export default resetPasswordService
