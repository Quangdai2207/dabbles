import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const executePaymentService = async (
  token: string,
  paymentId: string,
  payerId: string,
  localPaymentId: string,
  referenceId: string
): Promise<TResponseStatusObject<string>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(
    http.post(ApiBeUrls.paypal.execute, { paymentId, payerId, localPaymentId, referenceId }, { headers }),
    'execute payment failed'
  )
}

export default executePaymentService
