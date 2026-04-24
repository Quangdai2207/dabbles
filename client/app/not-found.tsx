import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import Link from 'next/link'
import BackButton from './(main)/_components/back-button'

export default function NotFound() {
  return (
    <div className='bg-background selection:bg-primary/20 flex h-screen w-full flex-col items-center justify-center px-4 text-center'>
      <div className='space-y-6'>
        {/* Abstract Decorative Elements */}
        <div className='relative mx-auto flex h-32 w-32 items-center justify-center'>
          <div className='bg-primary/10 absolute inset-0 animate-pulse rounded-full blur-3xl' />
          <h1 className='from-primary to-primary/20 bg-linear-to-b bg-clip-text text-9xl font-bold tracking-tighter text-transparent select-none'>
            404
          </h1>
        </div>

        <div className='space-y-2'>
          <h2 className='text-3xl font-bold tracking-tight'>Page not found</h2>
          <p className='text-muted-foreground mx-auto max-w-[500px]'>
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        <div className='flex items-center justify-center gap-4'>
          <BackButton />
          <Button size='lg' asChild className='shadow-primary/20 shadow-lg'>
            <Link href='/'>
              <Home className='mr-2 h-4 w-4' />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer text */}
      <div className='text-muted-foreground absolute bottom-8 text-xs'>
        © {new Date().getFullYear()} Dabble. All rights reserved.
      </div>
    </div>
  )
}
