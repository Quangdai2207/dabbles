import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

type TypeOfRequest = 'BLOCK' | 'UNBLOCK' | 'UNFOLLOW'

const unfollowOrBlockOrUnblockService = async (
  username: string,
  typeOfRequest: TypeOfRequest,
  token: string
): Promise<TResponseStatus> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  const payload = {
    username,
    typeOfRequest
  }
  return handleApiService<TResponseStatus>(
    http.post(ApiBeUrls.contact.unfollow_or_block_or_unblock, payload, { headers }),
    `${typeOfRequest} Service`
  )
}

export default unfollowOrBlockOrUnblockService
