import Footer from '@/components/partials/footer'
import HeaderNotLoggedIn from '@/components/partials/header-not-logged-in'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import TextMarquee from './text-marquee'
import ScrollToTop from './scroll-to-top'

const ViewNotLoggedIn = () => {
  return (
    <div className='relative flex w-full flex-col bg-white dark:bg-black' id='main-scroll-area'>
      <HeaderNotLoggedIn />
      <ScrollToTop />

      {/* Hero Section */}
      <section className='relative flex flex-col items-center justify-center overflow-hidden py-20 text-center md:py-32'>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523060-8da1d56ae167?q=80&w=2670')] bg-cover bg-center"></div>
        <div className='relative z-10 container mx-auto px-4'>
          <h1 className='text-5xl font-bold tracking-tight text-balance text-gray-900 sm:text-6xl dark:text-white'>
            @ Get your next idea
          </h1>
          <p className='mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300'>
            A place to save, organize, and share the things you love. Discover inspiration for your next project,
            dinner, or adventure.
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <Link href='/signup'>
              <Button
                size='lg'
                className='focus-visible:ring-ring rounded-full px-8 text-lg font-bold focus-visible:ring-2 focus-visible:outline-none'
              >
                Sign up
              </Button>
            </Link>
            <Link
              href='/login'
              className='focus-visible:ring-ring rounded-md text-sm leading-6 font-semibold text-gray-900 focus-visible:ring-2 focus-visible:outline-none dark:text-gray-100'
            >
              Log in <span aria-hidden='true'>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Infinite Marquee Section */}
      <TextMarquee />

      {/* Feature 1: Search */}
      <section className='container mx-auto grid grid-cols-1 items-center gap-12 px-4 py-24 md:grid-cols-2'>
        <div className='relative h-[400px] w-full overflow-hidden rounded-3xl bg-yellow-100 p-8 transition-all hover:shadow-xl'>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000')] bg-cover bg-center opacity-90 transition-transform duration-700 hover:scale-105"></div>
        </div>
        <div className='flex flex-col space-y-4 text-left'>
          <h2 className='text-4xl font-bold text-[#c28b00]'>Search for an idea</h2>
          <p className='text-xl text-gray-600 dark:text-gray-300'>
            What do you want to try next? Think of something you&apos;re into—like “easy chicken dinner” or “mid-century
            modern living room”—and see what you find.
          </p>
          <Link href='/explore'>
            <Button className='focus-visible:ring-ring w-fit rounded-full bg-[#c28b00] text-white hover:bg-[#a07400] focus-visible:ring-2 focus-visible:outline-none'>
              Explore
            </Button>
          </Link>
        </div>
      </section>

      {/* Parallax Break Section */}
      <section
        className='relative flex h-[600px] w-full items-center justify-center bg-cover bg-fixed bg-center bg-no-repeat'
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000')" }}
      >
        <div className='absolute inset-0 bg-black/50'></div>
        <div className='relative z-10 rounded-3xl border border-white/20 bg-white/10 p-8 text-center text-white backdrop-blur-sm'>
          <h2 className='text-5xl font-extrabold tracking-tight'>Find Your Aesthetic</h2>
          <p className='mt-4 text-2xl font-light'>Curate your world with things that inspire you.</p>
        </div>
      </section>

      {/* Feature 2: Save */}
      <section className='container mx-auto grid grid-cols-1 items-center gap-12 px-4 py-24 md:grid-cols-2'>
        <div className='order-2 flex flex-col space-y-4 text-left md:order-1'>
          <h2 className='text-4xl font-bold text-[#0076d3]'>Save ideas you like</h2>
          <p className='text-xl text-gray-600 dark:text-gray-300'>
            Collect your favorites so you can get back to them later. Organize them into boards to keep your ideas tidy.
          </p>
          <Link href='/signup'>
            <Button className='focus-visible:ring-ring w-fit rounded-full bg-[#0076d3] text-white hover:bg-[#005a9e] focus-visible:ring-2 focus-visible:outline-none'>
              Start Saving
            </Button>
          </Link>
        </div>
        <div className='relative order-1 h-[400px] w-full overflow-hidden rounded-3xl bg-blue-100 p-8 transition-all hover:shadow-xl md:order-2'>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080')] bg-cover bg-center opacity-90 transition-transform duration-700 hover:scale-105"></div>
        </div>
      </section>

      {/* Bento Grid / Inspiration Section */}
      <section className='container mx-auto px-4 py-24'>
        <h2 className='mb-12 text-center text-4xl font-bold text-gray-900 dark:text-gray-100'>Dive into details</h2>
        <div className='grid h-[800px] grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2'>
          <div className='group relative col-span-1 overflow-hidden rounded-3xl md:col-span-2 md:row-span-2'>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070')] bg-cover bg-center transition-transform duration-500 group-hover:scale-110"></div>
            <div className='absolute inset-0 flex items-end bg-linear-to-t from-black/70 to-transparent p-8'>
              <h3 className='text-3xl font-bold text-white'>Fashion</h3>
            </div>
          </div>
          <div className='group relative col-span-1 overflow-hidden rounded-3xl md:col-span-1 md:row-span-1'>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=2070')] bg-cover bg-center transition-transform duration-500 group-hover:scale-110"></div>
            <div className='absolute inset-0 flex items-end bg-linear-to-t from-black/70 to-transparent p-6'>
              <h3 className='text-2xl font-bold text-white'>Food</h3>
            </div>
          </div>
          <div className='group relative col-span-1 overflow-hidden rounded-3xl md:col-span-1 md:row-span-1'>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071')] bg-cover bg-center transition-transform duration-500 group-hover:scale-110"></div>
            <div className='absolute inset-0 flex items-end bg-linear-to-t from-black/70 to-transparent p-6'>
              <h3 className='text-2xl font-bold text-white'>Art</h3>
            </div>
          </div>
          <div className='group relative col-span-1 overflow-hidden rounded-3xl md:col-span-2 md:row-span-1'>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070')] bg-cover bg-center transition-transform duration-500 group-hover:scale-110"></div>
            <div className='absolute inset-0 flex items-end bg-linear-to-t from-black/70 to-transparent p-6'>
              <h3 className='text-2xl font-bold text-white'>Travel</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: Create/Do */}
      <section className='container mx-auto grid grid-cols-1 items-center gap-12 px-4 py-24 md:grid-cols-2'>
        <div className='relative h-[400px] w-full overflow-hidden rounded-3xl bg-pink-100 p-8 transition-all hover:shadow-xl'>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=2070')] bg-cover bg-center opacity-90 transition-transform duration-700 hover:scale-105"></div>
        </div>
        <div className='flex flex-col space-y-4 text-left'>
          <h2 className='text-primary text-4xl font-bold'>See it, make it, try it</h2>
          <p className='text-xl text-gray-600 dark:text-gray-300'>
            The best part of Dabble is discovering new things and actually doing them. From recipes to renovations, make
            it happen.
          </p>
          <Link href='/signup'>
            <Button
              size='lg'
              className='focus-visible:ring-ring w-fit rounded-full focus-visible:ring-2 focus-visible:outline-none'
            >
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className='relative w-full overflow-hidden bg-gray-50 py-32 text-center dark:bg-gray-900'>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070')] bg-cover bg-center opacity-5 dark:opacity-10"></div>
        <div className='relative z-10 flex flex-col items-center px-4'>
          <h2 className='mb-8 text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white'>
            Sign up to get your ideas
          </h2>
          <Link href='/signup'>
            <Button
              size='lg'
              className='focus-visible:ring-ring rounded-full px-8 py-6 text-lg font-bold focus-visible:ring-2 focus-visible:outline-none'
            >
              Sign up for Dabble
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default ViewNotLoggedIn
