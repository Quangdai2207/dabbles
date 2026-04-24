import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const createTransactionService = async (
  token: string,
  type: 'SUBSCRIBE' | 'PURCHASE',
  referenceId: string
): Promise<TResponseStatus> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(
    http.post(`${ApiBeUrls.transaction.createTransaction}`, { type, referenceId }, { headers }),
    'Create transaction failed'
  )
}

export default createTransactionService
