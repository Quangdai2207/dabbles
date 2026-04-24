import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Metadata } from 'next'

import { BarChart, Globe, Zap, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Business',
  description: 'Reach your audience where they are finding their next great idea with Dabble for Business.',
  openGraph: {
    title: 'Dabble for Business',
    description: 'Reach your audience where they are finding their next great idea with Dabble for Business.',
    images: ['/og-image.png']
  }
}

const BusinessPage = () => {
  return (
    <div className='mt-10 flex flex-col'>
      {/* Hero */}
      <div className='bg-black py-24 text-white'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='mb-6 text-5xl font-bold tracking-tight'>Dabble for Business</h1>
          <p className='mb-8 text-xl text-gray-300'>
            Reach your audience where they are finding their next great idea.
          </p>
          <div className='flex justify-center gap-4'>
            <Button size='lg' className='bg-white text-black hover:bg-gray-200'>
              Contact Sales
            </Button>
            <Button
              size='lg'
              variant='outline'
              className='border-white bg-transparent text-white hover:bg-white hover:text-black'
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Stats/Benefits */}
      <div className='container mx-auto px-4 py-24'>
        <div className='grid grid-cols-1 gap-12 md:grid-cols-3'>
          <div className='flex flex-col items-center text-center'>
            <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600'>
              <Globe className='h-8 w-8' />
            </div>
            <h3 className='mb-3 text-2xl font-bold'>Global Reach</h3>
            <p className='text-gray-600 dark:text-gray-400'>
              Connect with millions of users across the globe who are actively looking for inspiration.
            </p>
          </div>
          <div className='flex flex-col items-center text-center'>
            <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600'>
              <Zap className='h-8 w-8' />
            </div>
            <h3 className='mb-3 text-2xl font-bold'>High Engagement</h3>
            <p className='text-gray-600 dark:text-gray-400'>
              Our users don&apos;t just scroll—they save, plan, and do. Get your brand involved in their journey.
            </p>
          </div>
          <div className='flex flex-col items-center text-center'>
            <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600'>
              <BarChart className='h-8 w-8' />
            </div>
            <h3 className='mb-3 text-2xl font-bold'>Detailed Analytics</h3>
            <p className='text-gray-600 dark:text-gray-400'>
              Understand what resonates with your audience through our comprehensive insights dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Highlight */}
      <div className='bg-gray-50 py-24 dark:bg-gray-900'>
        <div className='container mx-auto grid grid-cols-1 items-center gap-16 px-4 md:grid-cols-2'>
          <div>
            <h2 className='mb-6 text-4xl font-bold text-gray-900 dark:text-white'>
              Showcase your products in a whole new way.
            </h2>
            <p className='mb-6 text-lg text-gray-600 dark:text-gray-300'>
              Don&apos;t just sell products—sell solutions/inspiration. With Dabble Business, you can create immersive
              Catalogues that help users visualize how your products fit into their lives.
            </p>
            <ul className='space-y-4'>
              <li className='flex items-center gap-3'>
                <Shield className='h-5 w-5 text-green-500' />
                <span className='text-gray-700 dark:text-gray-300'>Verified Brand Profile</span>
              </li>
              <li className='flex items-center gap-3'>
                <Shield className='h-5 w-5 text-green-500' />
                <span className='text-gray-700 dark:text-gray-300'>Priority Support</span>
              </li>
              <li className='flex items-center gap-3'>
                <Shield className='h-5 w-5 text-green-500' />
                <span className='text-gray-700 dark:text-gray-300'>Early Access to New Features</span>
              </li>
            </ul>
          </div>
          <div className='relative h-[500px] w-full overflow-hidden rounded-xl bg-white shadow-2xl'>
            <Image
              src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070'
              alt='Analytics Dashboard'
              layout='fill'
              objectFit='cover'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessPage
