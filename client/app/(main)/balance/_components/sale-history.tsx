import TransactionTable from './tables/transaction-table'
import PaginationControl from './pagination-control'
import getAllTransactionsService from '@/services/transaction/get-all-transactions'
import { TransactionGroup } from '@/constants/transaction-group'

interface SaleHistoryProps {
  token: string | null
  page: number
  sortByPriceDesc?: boolean | null
  sortByCreatedDateDesc?: boolean | null
  fromDate?: string
  toDate?: string
}

export default async function SaleHistory({
  token,
  page,
  sortByPriceDesc,
  sortByCreatedDateDesc,
  fromDate,
  toDate
}: SaleHistoryProps) {
  const { data: salesData } = await getAllTransactionsService(
    token || '',
    page - 1,
    TransactionGroup.SALE,
    sortByPriceDesc,
    sortByCreatedDateDesc,
    fromDate,
    toDate
  )

  const sales = salesData?.walletTransactionResponseDtos || []
  const totalPage = salesData?.totalPage || 0

  return (
    <>
      {sales.length > 0 ? (
        <>
          <TransactionTable transactions={sales} />
          <div className='mt-4'>
            <PaginationControl totalPages={totalPage} currentPage={page} />
          </div>
        </>
      ) : (
        <div className='text-muted-foreground py-8 text-center'>No sales found.</div>
      )}
    </>
  )
}
