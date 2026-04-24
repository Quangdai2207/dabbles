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
import { ArrowDownCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import createPaymentService from '@/services/paypal/create-payment'
import { toast } from 'sonner'

export default function DepositDialog() {
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { token } = useAuth()

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) < 100) {
      toast.error('Minimum deposit amount is $100')
      return
    }

    if (!token) {
      toast.error('You must be logged in to deposit funds')
      return
    }

    setIsProcessing(true)
    try {
      const res = await createPaymentService(token, Number(amount), 'DEPOSIT')

      if (!res.isSuccess) {
        toast.error(res.errorMessage || 'Failed to initiate deposit')
        return
      }

      if (res.isSuccess && res.data) {
        // Redirect to PayPal
        window.location.href = res.data
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='flex-1 gap-2'>
          <ArrowDownCircle className='h-4 w-4' /> Deposit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>Add funds to your account balance via PayPal (Min $100).</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='deposit-amount' className='text-right'>
              Amount ($)
            </Label>
            <Input
              id='deposit-amount'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type='number'
              min='100'
              step='0.01'
              className='col-span-3'
              placeholder='0.00'
              disabled={isProcessing}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleDeposit} disabled={!amount || isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Processing...
              </>
            ) : (
              'Confirm Deposit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
