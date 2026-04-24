import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const markReadService = async (notificationId: string, token: string): Promise<TResponseStatusObject<void>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(
    http.put(`${ApiBeUrls.notification.markRead}/${notificationId}`, {}, { headers }),
    'Mark notification as read failed'
  )
}

export default markReadService
