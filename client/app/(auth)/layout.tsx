import Image from 'next/image'
import Link from 'next/link'
import dabbleLogo from '@/assets/images/dabble-logo.png'

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className='flex min-h-screen w-full bg-white dark:bg-black'>
      {/* Left Side - Visuals (Hidden on mobile) */}
      <div className='relative hidden flex-col justify-between bg-zinc-900 p-12 text-white lg:flex lg:w-1/2'>
        <div className='absolute inset-0 bg-[url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2664&auto=format&fit=crop")] bg-cover bg-center opacity-30'></div>
        <div className='relative z-20 flex items-center gap-2 text-lg font-medium'>
          <Link href='/'>
            <Image src={dabbleLogo} alt='Dabble Logo' width={200} style={{ height: 'auto' }} />
          </Link>
        </div>
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;This library has saved me countless hours of work and helped me deliver stunning designs to my
              clients faster than ever before.&rdquo;
            </p>
            <footer className='text-sm text-gray-400'>Sofia Davis</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className='flex flex-1 flex-col items-center justify-center p-6 md:p-12'>
        <div className='w-full max-w-sm space-y-6'>
          {/* Mobile Logo */}
          <div className='mb-8 flex justify-center lg:hidden'>
            <Link href='/'>
              <Image src={dabbleLogo} alt='Dabble Logo' width={60} style={{ height: 'auto' }} />
            </Link>
          </div>

          {children}

          <p className='px-8 text-center text-sm text-gray-500'>
            By clicking continue, you agree to our{' '}
            <Link href='/terms' className='hover:text-primary underline underline-offset-4'>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href='/privacy' className='hover:text-primary underline underline-offset-4'>
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
