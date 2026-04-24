import TransactionTable from './tables/transaction-table'
import PaginationControl from './pagination-control'
import getAllTransactionsService from '@/services/transaction/get-all-transactions'
import { TransactionGroup } from '@/constants/transaction-group'

interface PurchaseHistoryProps {
  token: string | null
  page: number
  sortByPriceDesc?: boolean | null
  sortByCreatedDateDesc?: boolean | null
  fromDate?: string
  toDate?: string
}

export default async function PurchaseHistory({
  token,
  page,
  sortByPriceDesc,
  sortByCreatedDateDesc,
  fromDate,
  toDate
}: PurchaseHistoryProps) {
  const { data: purchasesData } = await getAllTransactionsService(
    token || '',
    page - 1,
    TransactionGroup.PURCHASE,
    sortByPriceDesc,
    sortByCreatedDateDesc,
    fromDate,
    toDate
  )

  const purchases = purchasesData?.walletTransactionResponseDtos || []
  const totalPage = purchasesData?.totalPage || 0

  return (
    <>
      {purchases.length > 0 ? (
        <>
          <TransactionTable transactions={purchases} />
          <div className='mt-4'>
            <PaginationControl totalPages={totalPage} currentPage={page} />
          </div>
        </>
      ) : (
        <div className='text-muted-foreground py-8 text-center'>No purchases found.</div>
      )}
    </>
  )
}
