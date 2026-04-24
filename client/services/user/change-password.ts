import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'
import http from '@/lib/http-request'

const changePasswordService = async (
  token: string,
  data: {
    currentPassword: string
    password: string
    passwordConfirm: string
  }
): Promise<TResponseStatus> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(http.put(ApiBeUrls.user.changePassword, data, { headers }), 'Change password failed')
}

export default changePasswordService
