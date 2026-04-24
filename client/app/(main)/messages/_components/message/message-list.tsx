'use client'

import Message from './message'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useRef, useMemo, useState } from 'react'
import { toDDMMYYYY } from '@/lib/time-convert'
import getMessagesConversation from '@/services/chat/get-message-conversation'
import { KeyedMutator } from 'swr'
import { ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

type MessagePosition = 'first' | 'middle' | 'last' | 'single'

const MessageList = ({
  messagesConversation,
  token,
  mutate
}: {
  messagesConversation: TMessageConversation[]
  token: string | null
  mutate: KeyedMutator<TResponseStatusObject<TMessageConversation[]>>
}) => {
  const viewportRef = useRef<HTMLDivElement>(null)

  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const isInitialLoad = useRef(true)
  const isAtBottomRef = useRef(true)
  const isLoadingRef = useRef(false)

  const [showScrollButton, setShowScrollButton] = useState(false)

  /* =======================
   * SCROLL LISTENER & BOTTOM OBSERVER
   * ======================= */
  useEffect(() => {
    const viewport = viewportRef.current
    const bottom = bottomRef.current
    if (!viewport || !bottom) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = viewport
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight

      // Show button if user scrolls up more than 100px from bottom
      if (distanceFromBottom > 100) {
        setShowScrollButton(true)
      } else {
        setShowScrollButton(false)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isAtBottomRef.current = entry.isIntersecting
        // detecting if at bottom to hide button is handled by scroll event mostly,
        // but this helps updating the ref for new messages auto-scroll logic
      },
      {
        root: viewport,
        threshold: 1
      }
    )

    viewport.addEventListener('scroll', handleScroll)
    observer.observe(bottom)

    return () => {
      viewport.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  /* =======================
   * AUTO SCROLL KHI MESSAGE THAY ĐỔI
   * ======================= */
  useEffect(() => {
    if (!bottomRef.current) return

    // load lần đầu
    if (isInitialLoad.current) {
      bottomRef.current.scrollIntoView({ block: 'end' })
      isInitialLoad.current = false
      return
    }

    // chỉ auto-scroll nếu user đang ở bottom
    if (isAtBottomRef.current) {
      bottomRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' })
    }
  }, [messagesConversation])

  /* =======================
   * TOP OBSERVER (load message cũ)
   * ======================= */
  useEffect(() => {
    if (!token) return
    const viewport = viewportRef.current
    const top = topRef.current
    if (!viewport || !top) return

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return
        if (isLoadingRef.current) return

        const firstMessage = messagesConversation[0]
        if (!firstMessage) return

        isLoadingRef.current = true
        const prevScrollHeight = viewport.scrollHeight

        const res = await getMessagesConversation(firstMessage.conversationId, token, firstMessage.createdDate)

        const olderMessages = res.data || []
        if (olderMessages.length === 0) {
          isLoadingRef.current = false
          return
        }

        mutate(
          (current) => {
            if (!current?.data) return current
            return {
              ...current,
              data: [...olderMessages, ...current.data]
            }
          },
          { revalidate: false }
        )

        requestAnimationFrame(() => {
          const newScrollHeight = viewport.scrollHeight
          viewport.scrollTop = newScrollHeight - prevScrollHeight
        })

        isLoadingRef.current = false
      },
      {
        root: viewport,
        threshold: 0
      }
    )

    observer.observe(top)
    return () => observer.disconnect()
  }, [messagesConversation, token, mutate])

  /* =======================
   * GROUP MESSAGE BY DATE
   * ======================= */
  const groupedMessages = useMemo(() => {
    // Deduplicate messages by ID first
    const uniqueMessages = Array.from(new Map(messagesConversation.map((msg) => [msg.id, msg])).values())

    const grouped: Record<string, TMessageConversation[]> = {}
    uniqueMessages.forEach((msg) => {
      const date = toDDMMYYYY(msg.createdDate)
      if (!grouped[date]) grouped[date] = []
      grouped[date].push(msg)
    })
    return grouped
  }, [messagesConversation])

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!messagesConversation || messagesConversation.length === 0) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <div className='text-muted-foreground text-center'>
          <p className='text-sm font-medium'>No messages here yet</p>
          <p className='mt-1 text-xs'>Start the conversation ✨</p>
        </div>
      </div>
    )
  }

  return (
    <div className='relative flex flex-1 flex-col overflow-hidden'>
      <ScrollArea className='flex-1' viewportRef={viewportRef}>
        <div className='p-4'>
          {/* TOP SENTINEL */}
          <div ref={topRef} />

          {Object.keys(groupedMessages).map((date) => (
            <div key={date}>
              <div className='text-muted-foreground my-1 text-center text-xs'>{date}</div>

              <div className='space-y-0.5'>
                {groupedMessages[date].map((msg, index, array) => {
                  const prevMsg = array[index - 1]
                  const nextMsg = array[index + 1]

                  const isFirstInBlock = !prevMsg || prevMsg.sender.id !== msg.sender.id
                  const isLastInBlock = !nextMsg || nextMsg.sender.id !== msg.sender.id

                  let positionInBlock: MessagePosition = 'single'
                  if (isFirstInBlock && !isLastInBlock) positionInBlock = 'first'
                  else if (!isFirstInBlock && !isLastInBlock) positionInBlock = 'middle'
                  else if (!isFirstInBlock && isLastInBlock) positionInBlock = 'last'

                  return (
                    <Message key={msg.id} message={msg} showAvatar={isLastInBlock} positionInBlock={positionInBlock} />
                  )
                })}
              </div>
            </div>
          ))}

          {/* BOTTOM SENTINEL */}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* SCROLL TO BOTTOM BUTTON */}
      {showScrollButton && (
        <div className='absolute bottom-4 left-1/2 z-10 -translate-x-1/2'>
          <Button
            size='icon'
            className='bg-background hover:bg-muted text-foreground h-8 w-8 rounded-full border shadow-md'
            onClick={scrollToBottom}
          >
            <ArrowDown className='h-4 w-4' />
          </Button>
        </div>
      )}
    </div>
  )
}

export default MessageList
