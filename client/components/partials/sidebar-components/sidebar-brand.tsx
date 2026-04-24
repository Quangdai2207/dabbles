'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import dLogo from '@/assets/images/d-logo.png'

const SidebarBrand = () => {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          href='/'
          className='group from-primary hover:shadow-primary/25 relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br to-purple-600 shadow-md transition-all duration-300 hover:scale-105'
        >
          <Image
            src={dLogo}
            alt='Dabble'
            width={48}
            height={48}
            priority
            className='ease-out-back size-8 object-cover transition-transform duration-500 group-hover:rotate-12'
          />
        </Link>
      </TooltipTrigger>
      <TooltipContent side='right' sideOffset={10} className='text-primary font-bold'>
        Dabble
      </TooltipContent>
    </Tooltip>
  )
}

export default SidebarBrand
