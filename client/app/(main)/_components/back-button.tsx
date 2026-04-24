'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  return (
    <Button
      variant='ghost'
      size='sm'
      className='text-muted-foreground hover:text-foreground gap-1 pl-0'
      onClick={() => router.back()}
    >
      <ChevronLeft className='h-4 w-4' />
      <span>Back</span>
    </Button>
  )
}
