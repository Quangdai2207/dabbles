'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface MaskedIdProps {
  id: string
}

export default function MaskedId({ id }: MaskedIdProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(id)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const masked = id.length > 8 ? `${id.slice(0, 4)}*****${id.slice(-4)}` : id

  return (
    <div className='flex items-center gap-2'>
      <span className='font-mono'>{masked}</span>
      <Button variant='ghost' size='icon' className='h-6 w-6' onClick={handleCopy}>
        {copied ? <Check className='h-3 w-3 text-green-500' /> : <Copy className='h-3 w-3' />}
        <span className='sr-only'>Copy ID</span>
      </Button>
    </div>
  )
}
