'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import { Loader2, MessageSquareDashed, MoreVertical, ShieldBan, Trash2, Unlock } from 'lucide-react'
import MessageInput from './message-input'
import MessageList from './message-list'
import { useChatLogic } from './useChatLogic'
import getImageUrl from '@/lib/get-images-url'
import { useConversationStore } from '@/lib/conversation-store'
import unfollowOrBlockOrUnblockService from '@/services/contact/unfollow-or-block-or-unblock'
import deleteMessageConversationService from '@/services/conversations/delete-message-conversation'
import { toast } from 'sonner'

import { memo, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const ChatView = () => {
  const { selectedConversationId, otherUser, messages, markConversationAsRead, mutate, token, blockStatus } =
    useChatLogic()
  const setConversation = useConversationStore((s) => s.setConversation)
  const getConversationById = useConversationStore((s) => s.getConversationById)
  const removeConversation = useConversationStore((s) => s.removeConversation)
  const setSelectedConversationId = useConversationStore((s) => s.setSelectedConversationId)
  const [isUnblocking, setIsUnblocking] = useState(false)
  const router = useRouter()

  const handleUnblock = async () => {
    if (!token || !otherUser || !selectedConversationId) return
    setIsUnblocking(true)
    try {
      const res = await unfollowOrBlockOrUnblockService(otherUser.username, 'UNBLOCK', token)
      if (res.isSuccess) {
        toast.success(`Unblocked @${otherUser.username}`)
        const conversation = getConversationById(selectedConversationId)
        if (conversation) {
          setConversation({ ...conversation, blockStatus: 'NONE' })
        }
      } else {
        toast.error(res.errorMessage || 'Failed to unblock user')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsUnblocking(false)
    }
  }

  const handleBlock = async () => {
    if (!token || !otherUser || !selectedConversationId) return
    try {
      const res = await unfollowOrBlockOrUnblockService(otherUser.username, 'BLOCK', token)
      if (res.isSuccess) {
        toast.success(`Blocked @${otherUser.username}`)
        const conversation = getConversationById(selectedConversationId)
        if (conversation) {
          setConversation({ ...conversation, blockStatus: 'BLOCKED' })
        }
      } else {
        toast.error(res.errorMessage || 'Failed to block user')
      }
    } catch {
      toast.error('An error occurred')
    }
  }

  const handleDeleteMessages = async () => {
    if (!token || !selectedConversationId) return
    try {
      const res = await deleteMessageConversationService(token, selectedConversationId)
      if (res.isSuccess) {
        toast.success('Messages deleted successfully')
        removeConversation(selectedConversationId)
      } else {
        toast.error(res.errorMessage || 'Failed to delete messages')
      }
    } catch {
      toast.error('An error occurred')
    }
  }

  // Redirect when otherUser becomes null (e.g., after deleting conversation)
  useEffect(() => {
    if (selectedConversationId && !otherUser) {
      setSelectedConversationId(null)
      router.push('/messages')
    }
  }, [selectedConversationId, otherUser, setSelectedConversationId, router])

  if (selectedConversationId === null) {
    return (
      <div className='bg-muted/20 flex h-full flex-col items-center justify-center gap-4'>
        <div className='bg-background animate-in zoom-in-50 rounded-full border p-8 shadow-sm duration-500'>
          <MessageSquareDashed className='text-primary/80 h-16 w-16' />
        </div>
        <div className='space-y-2 text-center'>
          <h2 className='text-2xl font-bold tracking-tight'>Dabble Messenger</h2>
          <p className='text-muted-foreground mx-auto max-w-xs text-sm'>
            Select a conversation from the sidebar to start messaging your network.
          </p>
        </div>
      </div>
    )
  }

  if (!otherUser) {
    return null
  }

  return (
    <div className='bg-background relative flex h-full flex-col'>
      {/* Header */}
      <div className='bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 flex items-center justify-between border-b p-4 backdrop-blur'>
        <div className='flex items-center gap-3'>
          <Link href={`/library/${otherUser.username}`} className='relative'>
            <div className='relative h-10 w-10 overflow-hidden rounded-full border shadow-sm'>
              {otherUser.avatar ? (
                <Image
                  src={getImageUrl(otherUser.avatar)}
                  alt={otherUser.name}
                  fill
                  className='object-cover'
                  unoptimized
                />
              ) : (
                <div className='bg-primary/10 text-primary flex h-full w-full items-center justify-center font-medium'>
                  {otherUser.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className='ring-background absolute right-0 bottom-0 block h-2.5 w-2.5 translate-x-px translate-y-px transform rounded-full bg-green-500 ring-2' />
          </Link>
          <div>
            <h3 className='text-sm leading-none font-semibold'>{otherUser.name}</h3>
            <span className='text-muted-foreground text-xs'>Active now</span>
          </div>
        </div>
        <div className='flex items-center gap-1'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='hover:bg-muted text-muted-foreground hover:text-foreground rounded-full'
              >
                <MoreVertical className='h-5 w-5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {blockStatus === 'NONE' && (
                <>
                  <DropdownMenuItem onClick={handleBlock} className='text-destructive focus:text-destructive'>
                    <ShieldBan className='mr-2 h-4 w-4' />
                    Block this user
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={handleDeleteMessages}>
                <Trash2 className='mr-2 h-4 w-4' />
                Delete messages
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className='relative flex flex-1 flex-col overflow-hidden' onClick={() => markConversationAsRead()}>
        <MessageList key={selectedConversationId} messagesConversation={messages} token={token} mutate={mutate} />
      </div>

      {/* Input */}
      <div className='p-4 pt-2'>
        {blockStatus === 'NONE' ? (
          <MessageInput selectedConversationId={selectedConversationId} />
        ) : blockStatus === 'BLOCKED' ? (
          <div className='bg-muted/50 flex items-center justify-center gap-3 rounded-2xl border p-4'>
            <span className='text-muted-foreground text-sm'>You have blocked this user.</span>
            <Button variant='outline' size='sm' onClick={handleUnblock} disabled={isUnblocking}>
              {isUnblocking ? (
                <Loader2 className='mr-1.5 h-4 w-4 animate-spin' />
              ) : (
                <Unlock className='mr-1.5 h-4 w-4' />
              )}
              Unblock
            </Button>
          </div>
        ) : (
          <div className='bg-muted/50 text-muted-foreground flex items-center justify-center rounded-2xl border p-4 text-sm'>
            You have been blocked by this user.
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ChatView)
