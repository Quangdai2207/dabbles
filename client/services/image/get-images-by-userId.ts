import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const getImagesByUserIdService = async (
  username: string,
  token: string | null | undefined,
  page: number = 0
): Promise<TResponseStatusObject<TPaginationPostImage>> => {
  let headers = {}
  if (token) {
    headers = {
      Authorization: `Bearer ${token}`
    }
  }
  return handleApiService(
    http.get(`${ApiBeUrls.images.getImagesByUser}/${username}?page=${page}`, {
      headers
    }),
    'Get images by user ID failed'
  )
}
export default getImagesByUserIdService
