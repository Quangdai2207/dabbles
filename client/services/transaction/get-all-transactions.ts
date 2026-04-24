import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

import { TransactionGroup } from '@/constants/transaction-group'

const getAllTransactionsService = async (
  token: string,
  page: number = 0,
  group: TransactionGroup,
  sortByPriceDesc?: boolean | null,
  sortByCreatedDateDesc?: boolean | null,
  fromDate?: string, // yyyy-MM-dd
  toDate?: string // yyyy-MM-dd
): Promise<TResponseStatusObject<TTransactionDto>> => {
  const headers = {
    Authorization: `Bearer ${token}`
  }

  const params = new URLSearchParams()

  params.append('page', page.toString())
  params.append('group', group)

  if (sortByPriceDesc !== null && sortByPriceDesc !== undefined) {
    params.append('sortByPriceDesc', String(sortByPriceDesc))
  }

  if (sortByCreatedDateDesc !== null && sortByCreatedDateDesc !== undefined) {
    params.append('sortByCreatedDateDesc', String(sortByCreatedDateDesc))
  }

  if (fromDate) {
    params.append('fromDate', fromDate)
  }

  if (toDate) {
    params.append('toDate', toDate)
  }

  return handleApiService(
    http.get(`${ApiBeUrls.transaction.getAllTransactions}?${params.toString()}`, { headers }),
    'Get all transactions failed'
  )
}

export default getAllTransactionsService
