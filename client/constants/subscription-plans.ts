import getAllPlansService from '@/services/subscription-plan/get-all-plans'

export const STATIC_SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    duration: 'forever',
    description: 'Essential features for casual users.',
    features: [
      { name: 'Limit 20 Uploads', included: true },
      { name: 'Basic Profile', included: true },
      { name: 'Community Access', included: true },
      { name: 'Verified Badge', included: false },
      { name: 'Reduced Transaction Fees', included: false },
      { name: 'Priority Listing', included: false },
      { name: 'VIP Support', included: false }
    ],
    cta: 'Current Plan',
    popular: false,
    variant: 'outline' as const
  },
  {
    id: '019c12d7-b3bf-7d2e-8be1-d3af426204ab',
    name: 'Monthly',
    price: 20,
    duration: 'per month',
    description: 'Unlock premium features and grow faster.',
    features: [
      { name: 'Unlimited Uploads', included: true },
      { name: 'Enhanced Profile', included: true },
      { name: 'Community Access', included: true },
      { name: 'Verified Badge', included: true },
      { name: 'Reduced Transaction Fees', included: true },
      { name: 'Priority Listing', included: true },
      { name: 'VIP Support', included: false }
    ],
    cta: 'Subscribe Monthly',
    popular: true,
    variant: 'default' as const
  },
  {
    id: '019c12d7-e2e2-7797-97ab-33efa7efef30',
    name: 'Semi-Annual',
    price: 100,
    duration: 'every 6 months',
    description: 'Great value for committed creators.',
    features: [
      { name: 'Unlimited Uploads', included: true },
      { name: 'Enhanced Profile', included: true },
      { name: 'Community Access', included: true },
      { name: 'Verified Badge', included: true },
      { name: 'Reduced Transaction Fees', included: true },
      { name: 'Priority Listing', included: true },
      { name: 'VIP Support', included: false }
    ],
    cta: 'Subscribe 6 Months',
    popular: false,
    variant: 'secondary' as const,
    savings: 'Save ~17%'
  },
  {
    id: '019c12d7-2fb2-7ef7-aaf0-0a98a5741cfd',
    name: 'Annual',
    price: 180,
    duration: 'per year',
    description: 'Maximum savings and exclusive perks.',
    features: [
      { name: 'Unlimited Uploads', included: true },
      { name: 'Enhanced Profile', included: true },
      { name: 'Community Access', included: true },
      { name: 'Verified Badge', included: true },
      { name: 'Reduced Transaction Fees', included: true },
      { name: 'Priority Listing', included: true },
      { name: 'VIP Support', included: true }
    ],
    cta: 'Subscribe Yearly',
    popular: false,
    variant: 'secondary' as const,
    savings: 'Save 25%'
  },
  {
    id: '019c12d7-871d-787d-891b-87093345e903',
    name: 'Lifetime',
    price: 2000,
    duration: 'one-time',
    description: 'Pay once, enjoy premium benefits forever.',
    features: [
      { name: 'Unlimited Uploads', included: true },
      { name: 'Enhanced Profile', included: true },
      { name: 'Community Access', included: true },
      { name: 'Verified Badge', included: true },
      { name: 'Reduced Transaction Fees', included: true },
      { name: 'Priority Listing', included: true },
      { name: 'VIP Support', included: true }
    ],
    cta: 'Get Lifetime Access',
    popular: false,
    variant: 'default' as const,
    savings: 'Best Value'
  }
]

export const SUBSCRIPTION_PLANS = async () => {
  const response = await getAllPlansService()
  if (!response.data) {
    return STATIC_SUBSCRIPTION_PLANS
  }

  const backendPlans = response.data

  return STATIC_SUBSCRIPTION_PLANS.map((plan) => {
    const backendPlan = backendPlans.find((bp) => bp.id === plan.id)
    if (backendPlan) {
      return {
        ...plan,
        id: backendPlan.id,
        price: backendPlan.price
      }
    }
    return plan
  })
}

// Keep export for types if needed, or derived type
export type TClientSubscriptionPlan = (typeof STATIC_SUBSCRIPTION_PLANS)[number]
