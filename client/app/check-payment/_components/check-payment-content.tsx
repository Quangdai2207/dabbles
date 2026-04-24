'use client'

import { ArrowLeft, CheckCircle2, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import executePaymentService from '@/services/paypal/execute-payment'

enum PaymentType {
  DEPOSIT = 'DEPOSIT',
  SUBSCRIPTION = 'SUBSCRIPTION',
  SALE = 'SALE',
  PURCHASE = 'PURCHASE'
}

export default function CheckPaymentContent({ token }: { token: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const executedRef = useRef(false)

  const localPaymentId = searchParams.get('localPaymentId')
  const paymentId = searchParams.get('paymentId')
  const status = searchParams.get('status')
  const referenceID = searchParams.get('referenceId')
  const payerId = searchParams.get('PayerID')
  const type = searchParams.get('type') as PaymentType

  const [isProcessing, setIsProcessing] = useState(true)
  const [result, setResult] = useState<'success' | 'error' | null>(null)
  const [message, setMessage] = useState<string>('Verifying transaction details...')

  useEffect(() => {
    // Clear the reload flag on successful load so it can trigger again for future payments
    sessionStorage.removeItem('check_payment_reloaded')
  }, [])

  // Helper for dynamic text
  const getTexts = (t: PaymentType) => {
    switch (t) {
      case PaymentType.DEPOSIT:
        return {
          processing: 'Verifying Deposit',
          success: 'Deposit Successful',
          error: 'Deposit Failed',
          successMsg: 'Funds have been added to your balance.'
        }
      case PaymentType.PURCHASE:
      case PaymentType.SALE:
        return {
          processing: 'Verifying Purchase',
          success: 'Purchase Successful',
          error: 'Purchase Failed',
          successMsg: 'Your purchase has been confirmed.'
        }
      case PaymentType.SUBSCRIPTION:
        return {
          processing: 'Verifying Subscription',
          success: 'Subscription Active',
          error: 'Subscription Failed',
          successMsg: 'Your subscription has been activated.'
        }
      default:
        return {
          processing: 'Verifying Payment',
          success: 'Payment Successful',
          error: 'Transaction Failed',
          successMsg: 'Your transaction has been completed.'
        }
    }
  }

  const texts = getTexts(type)

  useEffect(() => {
    const processPayment = async () => {
      // Prevent double execution
      if (executedRef.current) return
      executedRef.current = true

      // 1. Validate Parameters
      if (!status || !referenceID || !localPaymentId || !type) {
        setIsProcessing(false)
        setResult('error')
        setMessage('Missing transaction parameters.')
        return
      }

      // 2. Handle Failed Status immediately
      if (status === 'false') {
        setIsProcessing(false)
        setResult('error')
        setMessage('Payment was cancelled or failed.')
        return
      }

      // 3. Execute Payment for Success Status
      if (status === 'true') {
        if (!token || !paymentId || !payerId) {
          setIsProcessing(false)
          setResult('error')
          setMessage('Missing critical payment identifiers.')
          return
        }

        try {
          const res = await executePaymentService(token, paymentId, payerId, localPaymentId, referenceID)

          if (res.isSuccess) {
            setResult('success')
            setMessage(texts.successMsg)
            setTimeout(() => router.push('/balance'), 3000)
          } else {
            setResult('error')
            setMessage(res.message || 'Verification failed. Please contact support.')
          }
        } catch {
          setResult('error')
          setMessage('An unexpected error occurred during verification.')
        } finally {
          setIsProcessing(false)
        }
      }
    }

    processPayment()
  }, [status, referenceID, payerId, localPaymentId, paymentId, token, type, router, texts.successMsg])

  // UI Configuration
  let StatusIcon = Loader2
  let statusColor = 'text-blue-500'
  let statusBg = 'bg-blue-50'
  let title = texts.processing

  if (isProcessing) {
    StatusIcon = Loader2
    statusColor = 'text-blue-500'
    statusBg = 'bg-blue-50'
    title = texts.processing
  } else if (result === 'success') {
    StatusIcon = CheckCircle2
    statusColor = 'text-green-500'
    statusBg = 'bg-green-50'
    title = texts.success
  } else if (result === 'error') {
    StatusIcon = XCircle
    statusColor = 'text-red-500'
    statusBg = 'bg-red-50'
    title = texts.error
  }

  return (
    <div className='bg-background flex min-h-screen items-center justify-center p-4'>
      <div className='container max-w-lg'>
        <Card className='bg-card/50 border-muted-foreground/10 backdrop-blur-sm'>
          <CardHeader className='text-center'>
            <div className='mb-6 flex justify-center'>
              <div className={cn('rounded-full p-4', statusBg)}>
                <StatusIcon className={cn('h-16 w-16', statusColor, isProcessing && 'animate-spin')} />
              </div>
            </div>
            <CardTitle className='text-3xl font-bold tracking-tight'>{title}</CardTitle>
            <CardDescription className='mt-2 text-lg font-medium text-balance'>{message}</CardDescription>
          </CardHeader>

          <CardContent className='space-y-6'>
            {!isProcessing && result === 'success' ? (
              <div className='rounded-lg bg-green-500/10 p-4 text-center'>
                <p className='text-sm font-semibold text-green-600 dark:text-green-400'>
                  Your balance has been updated.
                </p>
              </div>
            ) : null}

            <Separator className='opacity-50' />

            <div className='space-y-3 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Reference ID</span>
                <span className='font-mono font-medium'>{referenceID || 'N/A'}</span>
              </div>
              {paymentId && (
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Payment ID</span>
                  <span className='max-w-[200px] truncate font-mono font-medium' title={paymentId}>
                    {paymentId}
                  </span>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className='flex flex-col gap-3 pb-8'>
            <Button
              asChild
              className={cn(
                'h-12 w-full rounded-xl text-lg font-bold shadow-lg',
                isProcessing && 'pointer-events-none opacity-50'
              )}
              size='lg'
            >
              <Link href='/balance'>
                {result === 'success' ? 'Go to Balance' : 'Return to Balance'}
                <ArrowLeft className='order-first mr-0 ml-2 h-5 w-5 rotate-180' />
              </Link>
            </Button>
            {result === 'error' ? (
              <Button variant='ghost' className='w-full' asChild>
                <Link href='/support'>Need Help?</Link>
              </Button>
            ) : null}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
