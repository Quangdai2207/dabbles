import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const getPurchasedImagesService = async (
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
    http.get(`${ApiBeUrls.images.getAllPurchasedImages}?page=${page}`, {
      headers
    }),
    'Get purchased images failed'
  )
}
export default getPurchasedImagesService
