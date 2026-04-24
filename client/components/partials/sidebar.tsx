'use client'

import { useAuthStore } from '@/lib/auth-store'
import { Bell, Bolt, Home, Library, MessageCircle, PlusSquare, Wallet } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { TooltipProvider } from '../ui/tooltip'
import SidebarBrand from './sidebar-components/sidebar-brand'
import SidebarLink, { NavLink } from './sidebar-components/sidebar-link'
import { useSidebarLogic } from './sidebar-components/use-sidebar-logic'

const Sidebar = () => {
  const pathname = usePathname()
  const authData = useAuthStore((s) => s.authData)
  const { totalUnreadConversations, totalUnreadNotifications } = useSidebarLogic()

  const mainLinks: NavLink[] = [
    { href: '/', icon: Home, label: 'Home' },
    { href: `/library/${authData && authData.username}`, icon: Library, label: 'Library' },
    { href: '/uploads', icon: PlusSquare, label: 'Create' },
    {
      href: '/notifications',
      icon: Bell,
      label: 'Notifications',
      count: totalUnreadNotifications
    },
    { href: '/messages', icon: MessageCircle, label: 'Messages', count: totalUnreadConversations },
    { href: '/balance', icon: Wallet, label: 'Balance Account' }
  ]

  const bottomLinks: NavLink[] = [{ href: '/settings', icon: Bolt, label: 'Settings' }]

  return (
    <aside className='bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-40 hidden h-screen w-20 flex-col items-center justify-between border-r pt-8 pb-6 backdrop-blur md:flex'>
      <div className='flex flex-col items-center gap-8'>
        <TooltipProvider>
          <SidebarBrand />
          <nav className='flex flex-col items-center gap-4'>
            {mainLinks.map((link) => (
              <SidebarLink key={link.href} link={link} isActive={pathname === link.href} />
            ))}
          </nav>
        </TooltipProvider>
      </div>

      <div className='flex flex-col items-center gap-4'>
        <TooltipProvider>
          {bottomLinks.map((link) => (
            <SidebarLink key={link.href} link={link} isActive={pathname === link.href} />
          ))}
        </TooltipProvider>
      </div>
    </aside>
  )
}

export default Sidebar
