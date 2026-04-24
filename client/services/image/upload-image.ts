import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const uploadImageService = async (formData: FormData, token: string | null | undefined): Promise<TResponseStatus> => {
  let headers = {}
  if (!token) {
    throw new Error('Token is required')
  }
  headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(
    http.post(ApiBeUrls.images.upload, formData, {
      headers
    }),
    'Upload image failed'
  )
}
export default uploadImageService
