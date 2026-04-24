import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const commentImageById = async (
  imageId: string,
  content: string,
  parentId: string | '',
  token: string | null | undefined
): Promise<TResponseStatusObject<TPostImageDetails>> => {
  let headers = {}
  if (token) {
    headers = {
      Authorization: `Bearer ${token}`
    }
  }
  const payload = { imageId, content, parentId }
  return handleApiService(
    http.post(ApiBeUrls.images.commentImageById, payload, {
      headers
    }),
    'Comment image failed'
  )
}
export default commentImageById
