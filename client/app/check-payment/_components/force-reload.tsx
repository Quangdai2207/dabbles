'use client'

import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const ForceReload = () => {
  const router = useRouter()

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem('check_payment_reloaded')

    if (!hasReloaded) {
      sessionStorage.setItem('check_payment_reloaded', 'true')
      window.location.reload()
    } else {
      // If we already reloaded and still no token, redirect to login
      router.push('/login')
    }
  }, [router])

  return (
    <div className='bg-background flex h-screen w-full flex-col items-center justify-center gap-4'>
      <div className='animate-spin'>
        <Loader2 className='text-primary h-10 w-10' />
      </div>
      <p className='text-muted-foreground'>Verifying session...</p>
    </div>
  )
}

export default ForceReload
