import { Loader2Icon } from 'lucide-react'

import { cn } from '@/lib/utils'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <div className={cn('animate-spin', className)} role='status' aria-label='Loading'>
      <Loader2Icon className='size-full' {...props} />
    </div>
  )
}

export { Spinner }
