import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const getListPendingService = async (token: string): Promise<TResponseStatusObject<TPendingUser[]>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(http.get(ApiBeUrls.contact.pending, { headers }), 'Get list pending failed')
}

export default getListPendingService
