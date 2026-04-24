'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import dabbleLogo from '@/assets/images/dabble-logo.png'
import PublicSearchBar from '@/components/partials/public-search-bar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Search, X } from 'lucide-react'
import { useState } from 'react'

const HeaderNotLoggedIn = () => {
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  return (
    <header className='fixed top-0 right-0 left-0 z-50 w-full border-b border-transparent bg-white/80 backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-black/80'>
      <div className='container mx-auto flex h-20 items-center justify-between px-4 md:px-6'>
        {showMobileSearch ? (
          <div className='flex w-full items-center gap-2 md:hidden'>
            <PublicSearchBar className='flex' />
            <Button variant='ghost' size='icon' onClick={() => setShowMobileSearch(false)}>
              <X className='h-5 w-5' />
            </Button>
          </div>
        ) : (
          <>
            {/* Logo */}
            <Link href='/' className='flex items-center gap-2'>
              <Image src={dabbleLogo} alt='Dabble Logo' width={200} height={200} className='h-8 w-auto' />
            </Link>

            {/* Search Bar (Desktop) */}
            <PublicSearchBar />

            {/* Navigation Links (Desktop) */}
            <nav className='hidden items-center gap-6 md:flex'>
              <Link
                href='/explore'
                className='hover:text-primary text-sm font-medium text-gray-600 transition-colors dark:text-gray-300'
              >
                Explore
              </Link>
              <Link
                href='/about'
                className='hover:text-primary text-sm font-medium text-gray-600 transition-colors dark:text-gray-300'
              >
                About
              </Link>
              <Link
                href='/business'
                className='hover:text-primary text-sm font-medium text-gray-600 transition-colors dark:text-gray-300'
              >
                Business
              </Link>
              <Link
                href='/blog'
                className='hover:text-primary text-sm font-medium text-gray-600 transition-colors dark:text-gray-300'
              >
                Blog
              </Link>

              {/* Auth Buttons */}
              <div className='flex items-center gap-4'>
                <Link href='/login'>
                  <Button variant='ghost' className='hover:text-primary font-semibold hover:bg-transparent'>
                    Log in
                  </Button>
                </Link>
                <Link href='/signup'>
                  <Button
                    size='default'
                    className='rounded-full px-6 font-bold shadow-sm transition-transform hover:scale-105'
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Trigger */}
            <div className='flex items-center gap-2 md:hidden'>
              <Button variant='ghost' size='icon' onClick={() => setShowMobileSearch(true)}>
                <Search className='h-6 w-6' />
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <Menu className='h-6 w-6' />
                    <span className='sr-only'>Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
                  <nav className='mt-8 flex flex-col gap-6'>
                    <Link href='/explore' className='hover:text-primary text-lg font-medium transition-colors'>
                      Explore
                    </Link>
                    <Link href='/about' className='hover:text-primary text-lg font-medium transition-colors'>
                      About
                    </Link>
                    <Link href='/business' className='hover:text-primary text-lg font-medium transition-colors'>
                      Business
                    </Link>
                    <Link href='/blog' className='hover:text-primary text-lg font-medium transition-colors'>
                      Blog
                    </Link>
                    <div className='bg-border my-2 h-px' />
                    <Link href='/login' className='hover:text-primary text-lg font-medium transition-colors'>
                      Log in
                    </Link>
                    <Link href='/signup'>
                      <Button className='w-full rounded-full font-bold' size='lg'>
                        Sign Up
                      </Button>
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

export default HeaderNotLoggedIn
