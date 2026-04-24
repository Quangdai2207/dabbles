import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

type TypeOfRequest = 'FOLLOW' | 'ACCEPTED' | 'DENY'

const followOrAcceptOrDenyService = async (
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
    http.post(ApiBeUrls.contact.follow_or_accept_or_deny, payload, { headers }),
    `${typeOfRequest} Service`
  )
}

export default followOrAcceptOrDenyService
