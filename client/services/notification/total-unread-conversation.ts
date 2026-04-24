import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const totalUnreadNotificationService = async (token: string): Promise<TResponseStatusObject<number>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(
    http.get(ApiBeUrls.notification.totalUnreadNotifications, { headers }),
    'Get total unread notifications failed'
  )
}

export default totalUnreadNotificationService
