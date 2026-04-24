'use client'

import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export type NavLink = {
  href: string
  label: string
  icon: LucideIcon
  count?: number
}

type Props = {
  link: NavLink
  isActive: boolean
}

const SidebarLink = ({ link, isActive }: Props) => {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? 'secondary' : 'ghost'}
          size='icon'
          className={`focus-visible:ring-ring relative size-12 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:outline-none ${
            isActive
              ? 'bg-primary/10 text-primary hover:bg-primary/15 shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
          asChild
        >
          <Link href={link.href} className='flex items-center justify-center'>
            <link.icon
              className={`size-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100 group-hover:scale-110'}`}
            />
            {typeof link.count === 'number' && link.count > 0 && (
              <Badge className='border-background absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 bg-red-500 p-0 text-[10px] font-bold text-white shadow-sm ring-0'>
                {link.count > 99 ? '99+' : link.count}
              </Badge>
            )}
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent side='right' className='font-medium' sideOffset={10}>
        {link.label}
      </TooltipContent>
    </Tooltip>
  )
}

export default SidebarLink
