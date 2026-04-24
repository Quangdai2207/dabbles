import { Suspense } from 'react'
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

import GetAuthToken from '@/lib/get-auth-token'
import BalanceTabs from './_components/balance-tabs'
import TransactionHistory from './_components/transaction-history'
import PurchaseHistory from './_components/purchase-history'
import SaleHistory from './_components/sale-history'
import TransactionFilters from './_components/transaction-filters'

export default async function BalancePage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [resolvedSearchParams, token] = await Promise.all([searchParams, GetAuthToken()])

  const page = Number(resolvedSearchParams.page) || 1
  const tab = (resolvedSearchParams.tab as string) || 'transactions'

  // Extract filter params
  const sortByPriceDesc =
    resolvedSearchParams.sortByPriceDesc === 'true'
      ? true
      : resolvedSearchParams.sortByPriceDesc === 'false'
        ? false
        : null
  const sortByCreatedDateDesc =
    resolvedSearchParams.sortByCreatedDateDesc === 'true'
      ? true
      : resolvedSearchParams.sortByCreatedDateDesc === 'false'
        ? false
        : null
  const fromDate = resolvedSearchParams.fromDate as string
  const toDate = resolvedSearchParams.toDate as string

  return (
    <BalanceTabs defaultTab='transactions' validTabs={['transactions', 'purchases', 'sales']}>
      <TabsList className='grid w-full grid-cols-3 lg:w-[400px]'>
        <TabsTrigger value='transactions'>Transactions</TabsTrigger>
        <TabsTrigger value='purchases'>Purchases</TabsTrigger>
        <TabsTrigger value='sales'>Sales</TabsTrigger>
      </TabsList>

      <TabsContent value='transactions'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
            <div className='space-y-1.5'>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent deposits, withdrawals and subscriptions.</CardDescription>
            </div>
            <TransactionFilters />
          </CardHeader>
          <CardContent>
            <Suspense
              key={`transactions-${page}-${sortByPriceDesc}-${sortByCreatedDateDesc}-${fromDate}-${toDate}`}
              fallback={
                <div className='flex h-40 items-center justify-center'>
                  <Loader2 className='text-primary animate-spin' />
                </div>
              }
            >
              {tab === 'transactions' && (
                <TransactionHistory
                  token={token ?? null}
                  page={page}
                  sortByPriceDesc={sortByPriceDesc}
                  sortByCreatedDateDesc={sortByCreatedDateDesc}
                  fromDate={fromDate}
                  toDate={toDate}
                />
              )}
            </Suspense>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value='purchases'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
            <div className='space-y-1.5'>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>Items you have purchased.</CardDescription>
            </div>
            <TransactionFilters />
          </CardHeader>
          <CardContent>
            <Suspense
              key={`purchases-${page}-${sortByPriceDesc}-${sortByCreatedDateDesc}-${fromDate}-${toDate}`}
              fallback={
                <div className='flex h-40 items-center justify-center'>
                  <Loader2 className='text-primary animate-spin' />
                </div>
              }
            >
              {tab === 'purchases' && (
                <PurchaseHistory
                  token={token ?? null}
                  page={page}
                  sortByPriceDesc={sortByPriceDesc}
                  sortByCreatedDateDesc={sortByCreatedDateDesc}
                  fromDate={fromDate}
                  toDate={toDate}
                />
              )}
            </Suspense>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value='sales'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
            <div className='space-y-1.5'>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>Items you have sold.</CardDescription>
            </div>
            <TransactionFilters />
          </CardHeader>
          <CardContent>
            <Suspense
              key={`sales-${page}-${sortByPriceDesc}-${sortByCreatedDateDesc}-${fromDate}-${toDate}`}
              fallback={
                <div className='flex h-40 items-center justify-center'>
                  <Loader2 className='text-primary animate-spin' />
                </div>
              }
            >
              {tab === 'sales' && (
                <SaleHistory
                  token={token ?? null}
                  page={page}
                  sortByPriceDesc={sortByPriceDesc}
                  sortByCreatedDateDesc={sortByCreatedDateDesc}
                  fromDate={fromDate}
                  toDate={toDate}
                />
              )}
            </Suspense>
          </CardContent>
        </Card>
      </TabsContent>
    </BalanceTabs>
  )
}
