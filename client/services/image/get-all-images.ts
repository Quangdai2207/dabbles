import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const getAllImagesService = async (
  token: string | null | undefined,
  page: number = 0,
  category?: string,
  keyword?: string
): Promise<TResponseStatusObject<TPaginationPostImage>> => {
  let headers = {}
  if (token) {
    headers = {
      Authorization: `Bearer ${token}`
    }
  }
  return handleApiService(
    http.get(
      `${ApiBeUrls.images.getAllImages}?page=${page}${category ? `&category=${category}` : ''}${keyword ? `&keyword=${keyword}` : ''}`,
      {
        headers
      }
    ),
    'Get all images failed'
  )
}
export default getAllImagesService
