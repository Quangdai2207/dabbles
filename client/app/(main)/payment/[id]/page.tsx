'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import getImageUrl from '@/lib/get-images-url'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import getImagesByIdService from '@/services/image/get-images-by-id'
import createPaymentService from '@/services/paypal/create-payment'
import createTransactionService from '@/services/transaction/create-transactions'
import getWalletService from '@/services/wallet/get-wallet'
import { CreditCard, Wallet, ArrowRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

import { SUBSCRIPTION_PLANS, TClientSubscriptionPlan } from '@/constants/subscription-plans'

const fetcher = async ([id, token]: [string, string | null | undefined]) => {
  const res = await getImagesByIdService(id, token)
  if (!res.isSuccess) throw new Error('Failed to load image details')
  return res.data
}

export default function PaymentPage() {
  const { token } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [selectedMethod, setSelectedMethod] = useState<'balance' | 'paypal'>('balance')
  const [isProcessing, setIsProcessing] = useState(false)

  const [plans, setPlans] = useState<TClientSubscriptionPlan[]>([])
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const fetchedPlans = await SUBSCRIPTION_PLANS()
        setPlans(fetchedPlans)
      } catch (error) {
        console.error('Failed to fetch subscription plans:', error)
      } finally {
        setIsLoadingPlans(false)
      }
    }
    fetchPlans()
  }, [])

  const plan = plans.find((p) => p.id === id)
  const isSubscription = !!plan

  // Only fetch post if plans have loaded and it's NOT a subscription
  const shouldFetchPost = !isLoadingPlans && !isSubscription && id
  const { data: post, isLoading: isPostLoading } = useSWR(shouldFetchPost ? [id, token] : null, fetcher)
  const { data: wallet } = useSWR(token ? ['wallet', token] : null, ([, t]) => getWalletService(t))

  const balance = wallet?.data?.balance ?? 0
  const price = plan ? plan.price : (post?.price ?? 0)
  const hasSufficientBalance = balance >= price

  if (isLoadingPlans || isPostLoading) {
    return (
      <div className='bg-background/50 min-h-screen'>
        <div className='container mx-auto max-w-7xl pt-10'>
          <div className='grid gap-12 lg:grid-cols-12'>
            <div className='order-2 space-y-4 lg:order-1 lg:col-span-7'>
              <Skeleton className='aspect-4/3 w-full rounded-3xl' />
            </div>
            <div className='order-1 space-y-8 lg:order-2 lg:col-span-5'>
              <Skeleton className='h-12 w-3/4' />
              <Skeleton className='h-[400px] w-full rounded-3xl' />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post && !plan) {
    return (
      <div className='container flex h-[calc(100vh-80px)] flex-col items-center justify-center gap-4 text-center'>
        <h1 className='text-2xl font-bold'>Item not found</h1>
        <Button variant='outline' onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  const handleConfirmPayment = async () => {
    setIsProcessing(true)
    try {
      if (selectedMethod === 'balance') {
        if (!hasSufficientBalance) {
          toast.error('Insufficient balance')
          return
        }
        const paymentType = isSubscription ? 'SUBSCRIBE' : 'PURCHASE'
        const res = await createTransactionService(token!, paymentType, id)

        if (res.isSuccess) {
          toast.success('Payment successful')
          router.push(isSubscription ? '/subscription' : `/post/${id}`)
        } else {
          toast.error(res.errorMessage || 'Payment failed')
        }
      } else if (selectedMethod === 'paypal') {
        const paymentType = isSubscription ? 'SUBSCRIBE' : 'PURCHASE'
        const res = await createPaymentService(token!, price, paymentType, id)
        if (!res.isSuccess) {
          toast.error(res.errorMessage)
          return
        }
        if (res.isSuccess && res.data) {
          window.location.href = res.data
        }
      }
    } catch {
      toast.error('An error occurred processing the payment')
    } finally {
      if (selectedMethod !== 'paypal') {
        setIsProcessing(false)
      } else {
        setIsProcessing(false)
      }
    }
  }

  return (
    <div className='bg-background/50 min-h-screen pb-10'>
      <div className='container mx-auto max-w-7xl'>
        <div className='mb-10 space-y-2 pt-10 text-center md:text-left'>
          <h1 className='text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl'>
            Complete your <span className='text-primary'>{isSubscription ? 'subscription' : 'purchase'}</span>
          </h1>
          <p className='text-muted-foreground max-w-2xl text-lg md:text-xl'>
            Securely complete your transaction to access {isSubscription ? 'premium features' : 'this premium content'}.
          </p>
        </div>

        <div className='grid gap-12 lg:grid-cols-12'>
          {/* Left Column: Product Image or Icon */}
          <div className='order-2 flex flex-col gap-6 lg:order-1 lg:col-span-7'>
            <div className='bg-muted/30 relative flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-3xl border shadow-sm'>
              {isSubscription ? (
                <div className='flex flex-col items-center gap-4 p-8 text-center'>
                  <div className='bg-primary/10 rounded-full p-6'>
                    <CreditCard className='text-primary h-24 w-24' />
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-3xl font-bold'>{plan?.name} Plan</h3>
                    <p className='text-muted-foreground text-lg'>{plan?.description}</p>
                  </div>
                </div>
              ) : (
                <Image
                  src={getImageUrl(post?.imageUrls.w1080)}
                  alt={post?.description || 'Product image'}
                  fill
                  className='object-contain p-4'
                  unoptimized
                />
              )}
            </div>
          </div>

          {/* Right Column: details and payment */}
          <div className='order-1 flex flex-col gap-8 lg:order-2 lg:col-span-5'>
            <div className='bg-card/50 space-y-8 rounded-3xl border p-6 shadow-sm backdrop-blur-sm md:p-8'>
              {/* Product Details Header */}
              <div className='space-y-4'>
                <div className='flex items-start justify-between gap-4'>
                  <h2 className='line-clamp-2 text-2xl font-bold'>
                    {isSubscription ? `${plan?.name} Subscription` : post?.description || 'Premium Image License'}
                  </h2>
                  <Badge variant='secondary' className='shrink-0 px-3 py-1 text-lg font-bold'>
                    ${price}
                  </Badge>
                </div>

                {!isSubscription && post && (
                  <div className='text-muted-foreground flex items-center gap-3'>
                    <span className='text-sm'>Created by</span>
                    <div className='text-foreground bg-muted/50 flex items-center gap-2 rounded-full px-3 py-1 font-medium'>
                      <div className='relative h-6 w-6 overflow-hidden rounded-full'>
                        {post.creator.avatar ? (
                          <Image
                            src={getImageUrl(post.creator.avatar)}
                            alt=''
                            fill
                            className='object-cover'
                            unoptimized
                          />
                        ) : (
                          <div className='bg-muted flex h-full w-full items-center justify-center text-[10px]'>
                            {post.creator.name[0]}
                          </div>
                        )}
                      </div>
                      {post.creator.name}
                    </div>
                  </div>
                )}
                {isSubscription && (
                  <div className='flex flex-wrap gap-2'>
                    {plan?.features
                      .filter((f) => f.included)
                      .slice(0, 3)
                      .map((f, i) => (
                        <Badge key={i} variant='outline' className='text-xs'>
                          {f.name}
                        </Badge>
                      ))}
                    {plan?.features.length && plan.features.filter((f) => f.included).length > 3 && (
                      <Badge variant='outline' className='text-xs'>
                        +{plan.features.filter((f) => f.included).length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Payment Method Selection */}
              <div className='space-y-4'>
                <span className='text-lg font-semibold'>Select Payment Method</span>

                <div className='grid gap-4'>
                  {/* Balance Option */}
                  <div
                    className={cn(
                      'hover:bg-muted/50 flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all',
                      selectedMethod === 'balance' ? 'border-primary bg-primary/5' : 'border-muted-foreground/20',
                      !hasSufficientBalance && 'opacity-80'
                    )}
                    onClick={() => setSelectedMethod('balance')}
                  >
                    <div className='bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full'>
                      <Wallet className='h-6 w-6' />
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <span className={cn('text-lg font-bold', selectedMethod === 'balance' && 'text-primary')}>
                          My Balance
                        </span>
                        <span className='text-sm font-medium'>${balance}</span>
                      </div>
                      <p className='text-muted-foreground text-sm'>Use your available credits</p>
                    </div>
                  </div>

                  {/* PayPal Option */}
                  <div
                    className={cn(
                      'hover:bg-muted/50 flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all',
                      selectedMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
                    )}
                    onClick={() => setSelectedMethod('paypal')}
                  >
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'>
                      <CreditCard className='h-6 w-6' />
                    </div>
                    <div className='flex-1'>
                      <span className={cn('text-lg font-bold', selectedMethod === 'paypal' && 'text-primary')}>
                        PayPal
                      </span>
                      <p className='text-muted-foreground text-sm'>Secure checkout with PayPal</p>
                    </div>
                  </div>
                </div>

                {selectedMethod === 'balance' && !hasSufficientBalance && (
                  <div className='text-destructive rounded-lg bg-red-500/10 p-3 text-center text-sm font-medium'>
                    Insufficient balance. Please select Paypal or{' '}
                    <Link href='/balance' className='underline hover:text-red-600'>
                      top up here
                    </Link>
                    .
                  </div>
                )}
              </div>

              <Separator />

              {/* Total and Action */}
              <div className='space-y-6 pt-2'>
                <div className='flex items-end justify-between'>
                  <span className='text-muted-foreground font-medium'>Total to pay</span>
                  <span className='text-primary text-3xl font-extrabold'>${price}</span>
                </div>

                <Button
                  size='lg'
                  className='shadow-primary/20 hover:shadow-primary/40 h-14 w-full rounded-xl text-lg font-bold shadow-lg transition-all'
                  onClick={handleConfirmPayment}
                  disabled={(selectedMethod === 'balance' && !hasSufficientBalance) || isProcessing}
                >
                  {isProcessing ? (
                    <span className='flex items-center gap-2'>
                      <Loader2 className='h-5 w-5 animate-spin' /> Processing...
                    </span>
                  ) : (
                    <span className='flex items-center gap-2'>
                      Confirm Payment <ArrowRight className='h-5 w-5' />
                    </span>
                  )}
                </Button>

                <div className='flex justify-center'>
                  <Button variant='link' className='text-muted-foreground' onClick={() => router.back()}>
                    Cancel and go back
                  </Button>
                </div>

                <p className='text-muted-foreground text-center text-xs'>
                  By confirming, you agree to our Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
