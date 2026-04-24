import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const getAllBlockedService = async (token: string): Promise<TResponseStatusObject<TBlockedUser[]>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(http.get(`${ApiBeUrls.contact.getAllBlocked}`, { headers }), 'Get all blocked failed')
}

export default getAllBlockedService
