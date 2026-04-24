import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Github, Instagram, Linkedin, Twitter } from 'lucide-react'
import dabbleLogo from '@/assets/images/dabble-logo.png'

const Footer = () => {
  return (
    <footer className='border-t bg-white dark:border-gray-800 dark:bg-black'>
      <div className='container mx-auto px-4 py-12 md:py-16'>
        <div className='grid grid-cols-1 gap-12 md:grid-cols-4'>
          {/* Brand Column */}
          <div className='flex flex-col space-y-4'>
            <Link href='/'>
              <Image src={dabbleLogo} alt='Dabble Logo' width={240} height={240} />
            </Link>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Discover, save, and share your next big idea. The platform for creative minds and avid explorers.
            </p>
          </div>

          {/* Links Column 1 */}
          <div className='flex flex-col space-y-4'>
            <h3 className='font-semibold text-gray-900 dark:text-white'>Platform</h3>
            <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-400'>
              <li>
                <Link href='/explore' className='hover:text-primary transition-colors'>
                  Explore
                </Link>
              </li>
              <li>
                <Link href='/login' className='hover:text-primary transition-colors'>
                  Log in
                </Link>
              </li>
              <li>
                <Link href='/signup' className='hover:text-primary transition-colors'>
                  Sign up
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className='flex flex-col space-y-4'>
            <h3 className='font-semibold text-gray-900 dark:text-white'>Company</h3>
            <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-400'>
              <li>
                <Link href='/about' className='hover:text-primary transition-colors'>
                  About Us
                </Link>
              </li>
              <li>
                <Link href='/careers' className='hover:text-primary transition-colors'>
                  Careers
                </Link>
              </li>
              <li>
                <Link href='/privacy' className='hover:text-primary transition-colors'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href='/terms' className='hover:text-primary transition-colors'>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials Column */}
          <div className='flex flex-col space-y-4'>
            <h3 className='font-semibold text-gray-900 dark:text-white'>Connect</h3>
            <div className='flex space-x-4'>
              <Link href='#' className='hover:text-primary text-gray-500 transition-colors'>
                <Twitter className='h-5 w-5' />
              </Link>
              <Link href='#' className='hover:text-primary text-gray-500 transition-colors'>
                <Facebook className='h-5 w-5' />
              </Link>
              <Link href='#' className='hover:text-primary text-gray-500 transition-colors'>
                <Instagram className='h-5 w-5' />
              </Link>
              <Link href='#' className='hover:text-primary text-gray-500 transition-colors'>
                <Linkedin className='h-5 w-5' />
              </Link>
              <Link href='#' className='hover:text-primary text-gray-500 transition-colors'>
                <Github className='h-5 w-5' />
              </Link>
            </div>
          </div>
        </div>

        <div className='mt-12 flex flex-col items-center justify-between border-t border-gray-100 pt-8 md:flex-row dark:border-gray-800'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            © {new Date().getFullYear()} Dabble Inc. All rights reserved.
          </p>
          <div className='mt-4 flex space-x-6 md:mt-0'>
            <Link href='#' className='text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white'>
              Privacy
            </Link>
            <Link href='#' className='text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white'>
              Terms
            </Link>
            <Link href='#' className='text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white'>
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
