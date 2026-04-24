import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const markReadAllService = async (token: string): Promise<TResponseStatusObject<void>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(
    http.put(ApiBeUrls.notification.markReadAll, {}, { headers }),
    'Mark all notifications as read failed'
  )
}

export default markReadAllService
