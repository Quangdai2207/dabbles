import http from '@/lib/http-request'
import ApiNextUrls from '@/constants/api-next-urls'
import { handleApiService } from '@/lib/api-service-helper'

const logoutService = async (token: string): Promise<TResponseStatus> => {
  return handleApiService(http.post(ApiNextUrls.auth.logout, { token }), 'Logout failed')
}

export default logoutService
