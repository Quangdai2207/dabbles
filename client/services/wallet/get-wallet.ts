import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const getWalletService = async (token: string | null | undefined): Promise<TResponseStatusObject<TWallet>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return handleApiService(http.get(`${ApiBeUrls.wallet.getWallet}`, { headers }), 'Get wallet failed')
}

export default getWalletService
