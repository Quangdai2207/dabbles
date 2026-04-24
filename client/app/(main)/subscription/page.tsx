import GetAuthToken from '@/lib/get-auth-token'
import PricingSection from './_components/pricing-section'
import WhyUpgradeSection from './_components/why-upgrade-section'

export default async function SubscriptionPage() {
  const token = await GetAuthToken()

  return (
    <div className='bg-background px-4 md:px-6 lg:px-8'>
      <div className='mx-auto mb-16 max-w-3xl text-center'>
        <h1 className='mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl'>Upgrade your experience</h1>
        <p className='text-muted-foreground text-xl'>
          Choose the plan that fits your needs. Unlock exclusive features, verified status, and lower fees with our
          premium tiers.
        </p>
      </div>

      <PricingSection token={token} />
      <WhyUpgradeSection />
    </div>
  )
}
