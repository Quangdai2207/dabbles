import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'
import http from '@/lib/http-request'

const toggleAccountPrivacyService = async (token: string): Promise<TResponseStatus> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(
    http.put(ApiBeUrls.user.toggleAccountPrivacy, {}, { headers }),
    'Toggle account privacy failed'
  )
}

export default toggleAccountPrivacyService
