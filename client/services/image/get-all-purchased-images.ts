import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const getAllPurchasedImagesService = async (
  token: string | null | undefined,
  page: number = 0
): Promise<TResponseStatusObject<TPaginationPostImage>> => {
  const headers = { Authorization: `Bearer ${token}` }
  return handleApiService(
    http.get(`${ApiBeUrls.images.getAllPurchasedImages}?page=${page}`, {
      headers
    }),
    'Get all purchased images failed'
  )
}
export default getAllPurchasedImagesService
