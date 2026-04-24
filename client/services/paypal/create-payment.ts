import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const createPaymentService = async (
  token: string,
  amount: number,
  type: 'SUBSCRIBE' | 'PURCHASE' | 'DEPOSIT',
  referenceId?: string
): Promise<TResponseStatusObject<string>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(
    http.post(ApiBeUrls.paypal.create, { amount, type, referenceId }, { headers }),
    'Create payment failed'
  )
}

export default createPaymentService
