import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const getAllNotificationService = async (
  token: string,
  page: number = 0
): Promise<TResponseStatusObject<TNotificationDto>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(
    http.get(`${ApiBeUrls.notification.getNotifications}?page=${page}`, { headers }),
    'Get all notifications failed'
  )
}

export default getAllNotificationService
