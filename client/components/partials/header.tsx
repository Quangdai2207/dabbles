'use client'

import { UserMenuButton } from '@/components/partials/user-menu-button'
import { useClient } from '@/hooks/useClient'
import Image from 'next/image'
import getImageUrl from '@/lib/get-images-url'
import { useAuth } from '@/providers/AuthProvider'
import Link from 'next/link'
import { BadgeCheck, Sparkles, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SearchBar from '@/components/partials/search-bar'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { useStomp } from '@/providers/StompProvider'
import { useSidebarStore } from '@/lib/sidebar-store'
import { useConversationStore } from '@/lib/conversation-store'
import { usePathname } from 'next/navigation'
import dLogo from '@/assets/images/d-logo.png'
import { getRemainingDays } from '@/lib/time-convert'

const Header = () => {
  const { authData } = useAuth()
  const fullname = authData ? `${authData.firstName} ${authData.lastName}` : ''
  const avatar = authData ? authData.avatar : ''
  const isClient = useClient()
  const avatarUrl = avatar ? getImageUrl(avatar) : null
  const { connected, subscribe } = useStomp()
  const setTotalUnreadConversations = useSidebarStore((s) => s.setTotalUnreadConversations)
  const setConversation = useConversationStore((s) => s.setConversation)
  const setSelectedConversationId = useConversationStore((s) => s.setSelectedConversationId)
  const selectedConversationId = useConversationStore((s) => s.selectedConversationId)
  const pathname = usePathname()
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  const daysRemaining = authData?.expiredDay ? getRemainingDays(authData.expiredDay) : 0

  useEffect(() => {
    if (!selectedConversationId) return
    if (!pathname.includes('/messages')) {
      setSelectedConversationId(null)
    }
  }, [pathname, selectedConversationId, setSelectedConversationId])

  useEffect(() => {
    if (!connected) return

    const unsubscribe = subscribe('/user/queue/chat-updates', (message) => {
      let data: TSocketConversationUpdate
      try {
        data = JSON.parse(message.body)
      } catch {
        return
      }
      setTotalUnreadConversations(data.totalUnreadConversation)
      setConversation(data.conversationResponseForChatBoxDto)
    })
    return unsubscribe
  }, [connected, setConversation, setTotalUnreadConversations, subscribe])

  if (!isClient || !authData) return null

  return (
    <header className='bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-4 border-b px-4 backdrop-blur md:px-6'>
      {showMobileSearch ? (
        <div className='flex w-full items-center gap-2 md:hidden'>
          <SearchBar className='flex' />
          <Button variant='ghost' size='icon' onClick={() => setShowMobileSearch(false)}>
            <X className='h-5 w-5' />
          </Button>
        </div>
      ) : (
        <>
          <div className='md:hidden'>
            <Link href='/'>
              <Image src={dLogo} alt='Dabble' width={32} height={32} className='h-8 w-auto' />
            </Link>
          </div>
          <div className='hidden w-1/3 md:block' />

          <SearchBar className='hidden md:flex' />

          <div className='flex items-center gap-2 md:w-1/3 md:justify-end md:gap-6'>
            <Button variant='ghost' size='icon' className='md:hidden' onClick={() => setShowMobileSearch(true)}>
              <Search className='h-5 w-5' />
            </Button>
            {authData.expiredDay && new Date(authData.expiredDay) > new Date() ? (
              <div className='hidden items-center gap-2 md:flex'>
                <Badge variant='secondary'>
                  {daysRemaining > 365 * 99 ? 'Lifetime' : `${Math.max(0, daysRemaining)} days left`}
                </Badge>
                <Button
                  asChild
                  variant='outline'
                  size='sm'
                  className='focus-visible:ring-ring border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 gap-2 focus-visible:ring-2 focus-visible:outline-none'
                >
                  <Link href='/subscription'>
                    <Sparkles className='h-4 w-4 fill-current' />
                    <span className='font-bold'>Premium</span>
                  </Link>
                </Button>
              </div>
            ) : (
              <Button
                asChild
                variant='outline'
                size='sm'
                className='focus-visible:ring-ring hidden gap-2 border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 focus-visible:ring-2 focus-visible:outline-none md:flex dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-400 dark:hover:bg-amber-900/20'
              >
                <Link href='/subscription'>
                  <Sparkles className='h-4 w-4 fill-current' />
                  <span className='font-bold'>Upgrade</span>
                </Link>
              </Button>
            )}
            <Link
              href={`/library/${authData.username}`}
              className='focus-visible:ring-ring group flex items-center gap-3 rounded-full transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none'
            >
              <div className='flex flex-col items-end text-sm leading-none'>
                <span className='font-semibold'>{fullname}</span>
                <div className='flex items-center gap-1'>
                  <span className='text-muted-foreground text-xs'>@{authData.username}</span>
                  {authData.expiredDay && new Date(authData.expiredDay) > new Date() && (
                    <BadgeCheck className='h-3 w-3 fill-blue-500 text-white' />
                  )}
                </div>
              </div>
              <div className='border-border group-hover:border-primary/50 relative h-9 w-9 overflow-hidden rounded-full border shadow-sm'>
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={fullname} fill className='object-cover' unoptimized />
                ) : (
                  <div className='bg-muted text-muted-foreground flex h-full w-full items-center justify-center font-medium'>
                    {fullname?.charAt(0) ?? 'D'}
                  </div>
                )}
              </div>
            </Link>
            <UserMenuButton />
          </div>
        </>
      )}
    </header>
  )
}

export default Header
