'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SUBSCRIPTION_PLANS, STATIC_SUBSCRIPTION_PLANS, TClientSubscriptionPlan } from '@/constants/subscription-plans'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { getRemainingDays } from '@/lib/time-convert'

export default function PricingSection({ token }: { token?: string | null | undefined }) {
  const router = useRouter()
  const [plans, setPlans] = useState<TClientSubscriptionPlan[]>(STATIC_SUBSCRIPTION_PLANS)
  const { authData } = useAuth()

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const fetchedPlans = await SUBSCRIPTION_PLANS()
        setPlans(fetchedPlans)
      } catch (error) {
        console.error('Failed to fetch subscription plans:', error)
      }
    }
    fetchPlans()
  }, [])

  const handleSubscribe = async (planId: string) => {
    if (!token) {
      toast.error('You must be logged in to subscribe')
      return
    }
    router.push(`/payment/${planId}`)
  }

  const daysRemaining = authData?.expiredDay ? getRemainingDays(authData.expiredDay) : 0
  const isLifetime = daysRemaining > 365 * 99

  return (
    <div className='mx-auto grid max-w-360 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={cn(
            'relative flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl',
            plan.popular ? 'border-primary z-10 scale-105 shadow-lg' : 'border-muted'
          )}
        >
          {plan.popular ? (
            <div className='absolute inset-x-0 -top-4 flex justify-center'>
              <Badge className='bg-primary px-3 py-1 text-sm font-semibold'>Most Popular</Badge>
            </div>
          ) : null}
          {plan.savings ? (
            <div className='absolute top-4 right-4'>
              <Badge
                variant='secondary'
                className='bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
              >
                {plan.savings}
              </Badge>
            </div>
          ) : null}

          <CardHeader>
            <CardTitle className='text-2xl font-bold'>{plan.name}</CardTitle>
            <CardDescription className='mt-2 min-h-[40px]'>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className='flex-1'>
            <div className='mb-6'>
              <span className='text-4xl font-extrabold'>${plan.price}</span>
              <span className='text-muted-foreground ml-2'>/ {plan.duration}</span>
            </div>

            <ul className='space-y-3'>
              {plan.features.map((feature, idx) => (
                <li key={idx} className='flex items-center gap-3'>
                  {feature.included ? (
                    <div className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'>
                      <Check className='h-3 w-3' />
                    </div>
                  ) : (
                    <div className='bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full'>
                      <X className='h-3 w-3' />
                    </div>
                  )}
                  <span className={cn('text-sm', !feature.included && 'text-muted-foreground line-through opacity-70')}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {!isLifetime && (
              <Button
                variant={plan.variant}
                className='w-full font-bold'
                size='lg'
                disabled={plan.name === 'Free'}
                onClick={() => handleSubscribe(plan.id)}
              >
                {plan.cta}
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
