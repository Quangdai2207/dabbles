import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

interface UpdateImageRequest {
  description: string
  price: number
  categoryIds: string[]
  visible: boolean
}

const updateImageService = async (
  data: UpdateImageRequest,
  token: string,
  imageId: string
): Promise<TResponseStatus> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(
    http.put(ApiBeUrls.images.update + `/${imageId}`, data, {
      headers
    }),
    'Update image failed'
  )
}
export default updateImageService
