import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const removeNotificationService = async (
  notificationId: string,
  token: string
): Promise<TResponseStatusObject<void>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(
    http.delete(`${ApiBeUrls.notification.removeNotification}/${notificationId}`, { headers }),
    'Remove notification failed'
  )
}

export default removeNotificationService
