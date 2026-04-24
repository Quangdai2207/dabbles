'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowUpCircle } from 'lucide-react'

export default function WithdrawDialog() {
  const [amount, setAmount] = useState('')

  const handleWithdraw = () => {
    if (!amount) return
    setAmount('')
    // In a real app, call a Server Action or API here
  }

  return (
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
  )
}
