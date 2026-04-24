import { Badge } from '@/components/ui/badge'
import { Check, Star, Zap, ShieldCheck } from 'lucide-react'

export default function WhyUpgradeSection() {
  return (
    <div className='mx-auto mt-10 max-w-2xl text-center'>
      <h3 className='flex items-center justify-center gap-2 text-2xl font-bold'>
        <ShieldCheck className='text-primary h-6 w-6' />
        Why upgrade?
      </h3>
      <div className='grid grid-cols-1 gap-6 pt-6 text-left sm:grid-cols-3'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2 font-semibold'>
            <Badge
              variant='outline'
              className='flex h-8 w-8 items-center justify-center rounded-full border-blue-200 bg-blue-50 p-0 text-blue-600'
            >
              <Check className='h-4 w-4' />
            </Badge>
            Verified Badge
          </div>
          <p className='text-muted-foreground text-sm'>
            Stand out with a blue tick next to your name, building trust with buyers.
          </p>
        </div>
        <div className='space-y-2'>
          <div className='flex items-center gap-2 font-semibold'>
            <Badge
              variant='outline'
              className='flex h-8 w-8 items-center justify-center rounded-full border-purple-200 bg-purple-50 p-0 text-purple-600'
            >
              <Zap className='h-4 w-4' />
            </Badge>
            Lower Fees
          </div>
          <p className='text-muted-foreground text-sm'>
            Keep more of what you earn with significantly reduced transaction fees.
          </p>
        </div>
        <div className='space-y-2'>
          <div className='flex items-center gap-2 font-semibold'>
            <Badge
              variant='outline'
              className='flex h-8 w-8 items-center justify-center rounded-full border-amber-200 bg-amber-50 p-0 text-amber-600'
            >
              <Star className='h-4 w-4' />
            </Badge>
            Priority
          </div>
          <p className='text-muted-foreground text-sm'>
            Get featured on the homepage and appear higher in search results.
          </p>
        </div>
      </div>
    </div>
  )
}
