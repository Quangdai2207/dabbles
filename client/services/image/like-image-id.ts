import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const likeImagesById = async (
  imageId: string,
  token: string | null | undefined
): Promise<TResponseStatusObject<TPostImageDetails>> => {
  let headers = {}
  if (token) {
    headers = {
      Authorization: `Bearer ${token}`
    }
  }
  return handleApiService(
    http.post(
      `${ApiBeUrls.images.likeImageById}`,
      { imageId },
      {
        headers
      }
    ),
    'Like image failed'
  )
}
export default likeImagesById
