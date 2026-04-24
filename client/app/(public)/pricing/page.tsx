import PricingSection from '@/app/(main)/subscription/_components/pricing-section'
import WhyUpgradeSection from '@/app/(main)/subscription/_components/why-upgrade-section'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing. Choose the plan that fits your needs.',
  openGraph: {
    title: 'Dabble Pricing',
    description: 'Simple, transparent pricing. Choose the plan that fits your needs.',
    images: ['/og-image.png']
  }
}

export default function PricingPage() {
  return (
    <div className='bg-background mt-12 px-4 md:px-6 lg:px-8'>
      <div className='mx-auto mb-16 max-w-3xl text-center'>
        <h1 className='mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl'>Simple, transparent pricing</h1>
        <p className='text-muted-foreground text-xl'>
          Choose the plan that fits your needs. Unlock exclusive features, verified status, and lower fees with our
          premium tiers.
        </p>
      </div>
      <PricingSection />
      <WhyUpgradeSection />
    </div>
  )
}
