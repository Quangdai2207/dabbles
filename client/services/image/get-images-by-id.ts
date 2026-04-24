import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const getImagesByIdService = async (
  id: string,
  token: string | null | undefined
): Promise<TResponseStatusObject<TPostImageDetails>> => {
  let headers = {}
  if (token) {
    headers = {
      Authorization: `Bearer ${token}`
    }
  }
  return handleApiService(
    http.get(`${ApiBeUrls.images.getImageById}/${id}`, {
      headers
    }),
    'Get images by ID failed'
  )
}
export default getImagesByIdService
