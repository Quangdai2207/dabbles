'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowDownCircle, ArrowUpCircle, DollarSign, ShoppingBag, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// Mock Data
const MOCK_TRANSACTIONS = [
  { id: 'TRX-001', type: 'Deposit', amount: 500.0, date: '2024-01-15', status: 'Completed' },
  { id: 'TRX-002', type: 'Withdrawal', amount: 200.0, date: '2024-01-20', status: 'Processing' },
  { id: 'TRX-003', type: 'Deposit', amount: 1000.0, date: '2024-02-01', status: 'Completed' }
]

const MOCK_PURCHASES = [
  { id: 'ORD-001', item: 'Premium Icon Set', amount: 25.0, date: '2024-01-18', seller: 'DesignMaster' },
  { id: 'ORD-002', item: 'UI Kit Bundle', amount: 45.0, date: '2024-01-25', seller: 'CreativeDuo' }
]

const MOCK_SALES = [
  { id: 'SALE-001', item: 'Abstract Wallpaper Pack', amount: 15.0, date: '2024-01-22', buyer: 'User123' },
  { id: 'SALE-002', item: 'Custom Illustration', amount: 80.0, date: '2024-02-05', buyer: 'DevAgency' }
]

interface BalanceViewProps {
  wallet: TWallet | null | undefined
}

export default function BalanceView({ wallet }: BalanceViewProps) {
  // Use wallet balance if available, otherwise default to 0
  // We keep local state for instant UI updates on deposit/withdraw if needed,
  // but ideally we should sync this with server state.
  // For now, let's initialize state with wallet balance.
  const [balance, setBalance] = useState(wallet?.balance || 0)
  const [amount, setAmount] = useState('')

  const handleDeposit = () => {
    // Mock deposit logic
    if (!amount) return
    setBalance((prev) => prev + parseFloat(amount))
    setAmount('')
  }

  const handleWithdraw = () => {
    // Mock withdraw logic
    if (!amount) return
    setBalance((prev) => prev - parseFloat(amount))
    setAmount('')
  }

  return (
    <div className='container mx-auto space-y-8 p-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Account Balance</h1>
        <p className='text-muted-foreground'>Manage your funds, view history, and handle transactions.</p>
      </div>

      {/* Balance Card */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='col-span-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Balance</CardTitle>
            <DollarSign className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            {/* Display prop-based wallet data or state override */}
            <div className='text-4xl font-bold'>${balance.toFixed(2)}</div>
            <p className='text-muted-foreground mt-1 text-xs'>Available for withdrawal</p>
            <div className='mt-6 flex gap-4'>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className='flex-1 gap-2'>
                    <ArrowDownCircle className='h-4 w-4' /> Deposit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Deposit Funds</DialogTitle>
                    <DialogDescription>Add funds to your account balance.</DialogDescription>
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='deposit-amount' className='text-right'>
                        Amount
                      </Label>
                      <Input
                        id='deposit-amount'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type='number'
                        className='col-span-3'
                        placeholder='0.00'
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleDeposit}>Confirm Deposit</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='outline' className='flex-1 gap-2'>
                    <ArrowUpCircle className='h-4 w-4' /> Withdraw
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Withdraw Funds</DialogTitle>
                    <DialogDescription>Withdraw funds to your connected bank account.</DialogDescription>
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='withdraw-amount' className='text-right'>
                        Amount
                      </Label>
                      <Input
                        id='withdraw-amount'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type='number'
                        className='col-span-3'
                        placeholder='0.00'
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleWithdraw}>Confirm Withdrawal</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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

      {/* Tables Section */}
      <Tabs defaultValue='transactions' className='w-full'>
        <TabsList className='grid w-full grid-cols-3 lg:w-[400px]'>
          <TabsTrigger value='transactions'>Transactions</TabsTrigger>
          <TabsTrigger value='purchases'>Purchases</TabsTrigger>
          <TabsTrigger value='sales'>Sales</TabsTrigger>
        </TabsList>

        <TabsContent value='transactions'>
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent deposits and withdrawals.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_TRANSACTIONS.map((trx) => (
                    <TableRow key={trx.id}>
                      <TableCell className='font-medium'>{trx.id}</TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          {trx.type === 'Deposit' ? (
                            <ArrowDownCircle className='h-4 w-4 text-green-500' />
                          ) : (
                            <ArrowUpCircle className='h-4 w-4 text-red-500' />
                          )}
                          {trx.type}
                        </div>
                      </TableCell>
                      <TableCell>{trx.date}</TableCell>
                      <TableCell>
                        <Badge variant={trx.status === 'Completed' ? 'default' : 'secondary'}>{trx.status}</Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${trx.type === 'Deposit' ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {trx.type === 'Deposit' ? '+' : '-'}${trx.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='purchases'>
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>Items you have purchased.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className='text-right'>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_PURCHASES.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className='font-medium'>{p.id}</TableCell>
                      <TableCell>{p.item}</TableCell>
                      <TableCell>{p.seller}</TableCell>
                      <TableCell>{p.date}</TableCell>
                      <TableCell className='text-right font-medium'>-${p.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='sales'>
          <Card>
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>Items you have sold.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sale ID</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className='text-right'>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_SALES.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className='font-medium'>{s.id}</TableCell>
                      <TableCell>{s.item}</TableCell>
                      <TableCell>{s.buyer}</TableCell>
                      <TableCell>{s.date}</TableCell>
                      <TableCell className='text-right font-medium text-green-600'>+${s.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
