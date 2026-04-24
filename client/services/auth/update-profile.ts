import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const updateProfileService = async (formData: FormData, token: string): Promise<TResponseStatusObject<TProfile>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(http.put(ApiBeUrls.user.updateProfile, formData, { headers }), 'Update profile failed')
}

export default updateProfileService
