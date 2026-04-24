import GetAuthToken from '@/lib/get-auth-token'
import WalletOverview from './_components/wallet-overview'

export default async function BalanceLayout({ children }: { children: React.ReactNode }) {
  const token = await GetAuthToken()

  return (
    <div className='container mx-auto space-y-8 p-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Account Balance</h1>
        <p className='text-muted-foreground'>Manage your funds, view history, and handle transactions.</p>
      </div>
      <WalletOverview token={token ?? null} />
      {children}
    </div>
  )
}
