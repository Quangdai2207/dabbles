import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const getCommentImageById = async (imageId: string): Promise<TResponseStatusObject<TCommentImage[]>> => {
  return handleApiService(http.get(`${ApiBeUrls.images.getCommentsByImageId}/${imageId}`), 'Comment image failed')
}
export default getCommentImageById
