import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const deleteImageService = async (
  token: string | null | undefined,
  id: string
): Promise<TResponseStatusObject<null>> => {
  let headers = {}
  if (token) {
    headers = {
      Authorization: `Bearer ${token}`
    }
  }
  return handleApiService(
    http.delete(`${ApiBeUrls.images.delete}/${id}`, {
      headers
    }),
    'Delete image failed'
  )
}
export default deleteImageService
