'use client'

import { useNow, useTimeAgo } from '@/hooks/useNow'
import Image from 'next/image'
import { useConversationStore } from '@/lib/conversation-store'
import getImageUrl from '@/lib/get-images-url'
import { useSidebarStore } from '@/lib/sidebar-store'
import { cn } from '@/lib/utils'
import { useStomp } from '@/providers/StompProvider'
import { useRouter } from 'next/navigation'
import { memo } from 'react'

const ConversationListItem = ({ conversation }: { conversation: TConversationResponseForChatBoxDto }) => {
  const selectedConversationId = useConversationStore((s) => s.selectedConversationId)
  const getConversationById = useConversationStore((s) => s.getConversationById)
  const setConversation = useConversationStore((s) => s.setConversation)

  const selected = conversation.id === selectedConversationId || conversation.id === 'tempConversation'
  const rawAvatar = conversation.avatar?.trim()
  const now = useNow()
  const lastTime = useTimeAgo(conversation.lastMessageAt!, now)
  const { connected, send } = useStomp()
  const setTotalUnreadConversations = useSidebarStore((s) => s.setTotalUnreadConversations)
  const totalUnreadConversations = useSidebarStore((s) => s.totalUnreadConversations)
  const router = useRouter()

  const markConversationAsRead = (conversationId: string) => {
    if (!connected) return
    const conversation = getConversationById(conversationId)
    if (!conversation || conversation.unreadMessageCount === 0) return
    send('/app/chat.markAsRead', { conversationId })
    setConversation({ ...conversation, unreadMessageCount: 0 })
    setTotalUnreadConversations(totalUnreadConversations - 1)
  }

  const handleClick = () => {
    if (selectedConversationId !== conversation.id) {
      router.push(`/messages?c=${conversation.id}`)
    }
    markConversationAsRead(conversation.id)
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all duration-200',
        selected ? 'bg-primary/10 hover:bg-primary/15' : 'hover:bg-muted/50'
      )}
    >
      <div className='relative'>
        <div className='border-background relative h-12 w-12 overflow-hidden rounded-full border-2 shadow-sm'>
          {rawAvatar ? (
            <Image src={getImageUrl(rawAvatar)} alt={conversation.name!} fill className='object-cover' unoptimized />
          ) : (
            <div className='bg-primary/10 text-primary flex h-full w-full items-center justify-center font-medium'>
              {conversation.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {/* Online status indicator placeholder - if available in future */}
        {/* <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" /> */}
      </div>

      <div className='min-w-0 flex-1 overflow-hidden'>
        <div className='flex items-center justify-between gap-2'>
          <h3
            className={cn(
              'truncate text-sm font-semibold',
              conversation.unreadMessageCount > 0 ? 'text-foreground' : 'text-foreground/90'
            )}
          >
            {conversation.name}
          </h3>
          <span
            className={cn(
              'shrink-0 text-[10px] font-medium',
              conversation.unreadMessageCount > 0 ? 'text-primary' : 'text-muted-foreground/50'
            )}
          >
            {lastTime}
          </span>
        </div>

        <div className='mt-0.5 flex items-center justify-between gap-2'>
          <p
            className={cn(
              'truncate text-xs',
              conversation.unreadMessageCount > 0 ? 'text-foreground font-semibold' : 'text-muted-foreground'
            )}
          >
            {conversation.lastMessage
              ? conversation.lastMessage.length > 30
                ? `${conversation.lastMessage.slice(0, 30)}...`
                : conversation.lastMessage
              : 'No messages'}
          </p>

          {conversation.unreadMessageCount > 0 && (
            <span className='bg-primary text-primary-foreground animate-in zoom-in flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold shadow-sm duration-200'>
              {conversation.unreadMessageCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(ConversationListItem)
