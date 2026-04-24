'use client'

import { useAuthStore } from '@/lib/auth-store'
import { Bell, Home, Library, MessageCircle, PlusSquare } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebarLogic } from './sidebar-components/use-sidebar-logic'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const MobileNav = () => {
  const pathname = usePathname()
  const authData = useAuthStore((s) => s.authData)
  const { totalUnreadConversations, totalUnreadNotifications } = useSidebarLogic()

  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: `/library/${authData?.username}`, icon: Library, label: 'Library' },
    { href: '/uploads', icon: PlusSquare, label: 'Create' },
    {
      href: '/notifications',
      icon: Bell,
      label: 'Notifications',
      count: totalUnreadNotifications
    },
    { href: '/messages', icon: MessageCircle, label: 'Messages', count: totalUnreadConversations }
  ]

  return (
    <div className='bg-background/80 supports-[backdrop-filter]:bg-background/60 fixed right-0 bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t px-2 backdrop-blur-lg md:hidden'>
      {links.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'group relative flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-all active:scale-95',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div className='relative'>
              <link.icon
                className={cn('h-6 w-6 transition-all', isActive ? 'scale-110' : 'group-hover:scale-105')}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {link.count && link.count > 0 ? (
                <Badge className='border-background absolute -top-1.5 -right-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full border-2 bg-red-500 px-1 text-[10px] text-white'>
                  {link.count > 99 ? '99+' : link.count}
                </Badge>
              ) : null}
            </div>
            <span
              className={cn(
                'text-[10px] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

export default MobileNav
