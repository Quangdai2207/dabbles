import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about Dabble, our mission, and the team behind the platform.',
  openGraph: {
    title: 'About Dabble',
    description: 'Learn more about Dabble, our mission, and the team behind the platform.',
    images: ['/og-image.png']
  }
}

const AboutPage = () => {
  return (
    <div className='container mx-auto mt-10 px-4 py-16 md:py-24'>
      {/* Hero Section */}
      <div className='mb-24 flex flex-col items-center text-center'>
        <h1 className='text-5xl font-bold tracking-tight text-balance text-gray-900 sm:text-6xl dark:text-white'>
          We are Dabble.
        </h1>
        <p className='mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
          We believe in the power of curiosity. Our mission is to provide a space where everyone can discover new
          passions, share their creativity, and connect with like-minded explorers.
        </p>
      </div>

      {/* Story Section */}
      <div className='mb-24 grid grid-cols-1 items-center gap-12 md:grid-cols-2'>
        <div className='relative h-[400px] w-full overflow-hidden rounded-3xl bg-gray-100'>
          <Image
            src='https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069'
            alt='Our Office'
            layout='fill'
            objectFit='cover'
            className='transition-transform duration-700 hover:scale-105'
          />
        </div>
        <div className='flex flex-col space-y-6'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>Our Story</h2>
          <p className='text-lg text-gray-600 dark:text-gray-300'>
            Founded in 2024, Dabble started as a small project to help people organize their messy internet bookmarks.
            It quickly grew into a vibrant community of creators, thinkers, and doers who wanted more than just a
            bookmarking tool—they wanted a place to truly *dabble* in their interests.
          </p>
          <p className='text-lg text-gray-600 dark:text-gray-300'>
            Today, we are a diverse team working from all over the world, united by our love for discovery and
            well-designed software.
          </p>
        </div>
      </div>

      {/* Team Section (Placeholder) */}
      <div className='mb-24'>
        <h2 className='mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white'>Meet the Team</h2>
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-3'>
          {[
            {
              name: 'Pham Minh Khang',
              role: 'Front-end Developer',
              image: 'https://i.ibb.co/jNnRR9f/gen-n-z7467735214461-826afdc1228dc58cc9d8d327adb31097.jpg'
            },
            {
              name: 'Tran Dao Bao Huan',
              role: 'Back-end Developer',
              image: 'https://i.ibb.co/0jgmZvmT/gen-h.jpg'
            },
            {
              name: 'Tran Quang Dai',
              role: 'Front-end Developer',
              image: 'https://i.ibb.co/FbXNMnbg/gen-h-z7467734968909-3d6d453547cd2fa7cc649a4ba8012740.jpg'
            }
          ].map((member) => (
            <div key={member.name} className='flex flex-col items-center space-y-4'>
              <div className='relative h-48 w-48 overflow-hidden rounded-full bg-gray-200'>
                <Image src={member.image} alt={member.name} layout='fill' objectFit='cover' />
              </div>
              <div className='text-center'>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white'>{member.name}</h3>
                <p className='text-gray-500'>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className='bg-primary/5 rounded-3xl p-12 text-center'>
        <h2 className='mb-6 text-3xl font-bold text-gray-900 dark:text-white'>Join our journey</h2>
        <p className='mb-8 text-lg text-gray-600 dark:text-gray-300'>
          Ready to start dabbling? Create your account today and see where your curiosity takes you.
        </p>
        <Link href='/signup'>
          <Button size='lg' className='rounded-full px-8 font-bold'>
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default AboutPage
