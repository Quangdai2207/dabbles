import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, ShoppingBag, Tag } from 'lucide-react'
import getWalletService from '@/services/wallet/get-wallet'
import DepositDialog from './deposit-dialog'
import WithdrawDialog from './withdraw-dialog'

interface WalletOverviewProps {
  token: string | null
}

export default async function WalletOverview({ token }: WalletOverviewProps) {
  const { data: wallet } = await getWalletService(token)

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card className='col-span-2'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Balance</CardTitle>
          <DollarSign className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-4xl font-bold'>${(wallet?.balance || 0).toFixed(2)}</div>
          <p className='text-muted-foreground mt-1 text-xs'>Available for withdrawal</p>
          <div className='mt-6 flex gap-4'>
            <DepositDialog />
            <WithdrawDialog />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Spent</CardTitle>
          <ShoppingBag className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>${(wallet?.totalSpent || 0).toFixed(2)}</div>
          <p className='text-muted-foreground mt-1 text-xs'>Lifetime purchases</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Earned</CardTitle>
          <Tag className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>${(wallet?.totalEarned || 0).toFixed(2)}</div>
          <p className='text-muted-foreground mt-1 text-xs'>Lifetime sales revenue</p>
        </CardContent>
      </Card>
    </div>
  )
}
