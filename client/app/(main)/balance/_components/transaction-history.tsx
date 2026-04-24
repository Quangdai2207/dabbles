import TransactionTable from './tables/transaction-table'
import PaginationControl from './pagination-control'
import getAllTransactionsService from '@/services/transaction/get-all-transactions'
import { TransactionGroup } from '@/constants/transaction-group'

interface TransactionHistoryProps {
  token: string | null
  page: number
  sortByPriceDesc?: boolean | null
  sortByCreatedDateDesc?: boolean | null
  fromDate?: string
  toDate?: string
}

export default async function TransactionHistory({
  token,
  page,
  sortByPriceDesc,
  sortByCreatedDateDesc,
  fromDate,
  toDate
}: TransactionHistoryProps) {
  const { data: transactionsData } = await getAllTransactionsService(
    token || '',
    page - 1,
    TransactionGroup.WALLET_FLOW,
    sortByPriceDesc,
    sortByCreatedDateDesc,
    fromDate,
    toDate
  )

  const transactions = transactionsData?.walletTransactionResponseDtos || []
  const totalPage = transactionsData?.totalPage || 0

  return (
    <>
      {transactions.length > 0 ? (
        <>
          <TransactionTable transactions={transactions} />
          <div className='mt-4'>
            <PaginationControl totalPages={totalPage} currentPage={page} />
          </div>
        </>
      ) : (
        <div className='text-muted-foreground py-8 text-center'>No transactions found.</div>
      )}
    </>
  )
}
