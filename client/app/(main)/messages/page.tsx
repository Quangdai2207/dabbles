'use client'

import Loading from '@/app/(main)/loading'
import { useConversationStore } from '@/lib/conversation-store'
import { useAuth } from '@/providers/AuthProvider'
import getConversationsService from '@/services/conversations/get-conversations'
import { useEffect, Suspense } from 'react'
import useSWR from 'swr'
import ConversationList from './_components/conversation/conversation-list'
import ChatView from '@/app/(main)/messages/_components/message/chat-view'
import { useStomp } from '@/providers/StompProvider'
import { useSidebarStore } from '@/lib/sidebar-store'
import { useSearchParams } from 'next/navigation'

const MessagePageContent = () => {
  const { token, isLoading, authData } = useAuth()
  const conversations = useConversationStore((s) => s.conversations)
  const selectedConversationId = useConversationStore((s) => s.selectedConversationId)
  const setSelectedConversationId = useConversationStore((s) => s.setSelectedConversationId)
  const getConversationById = useConversationStore((s) => s.getConversationById)
  const setTotalUnreadConversations = useSidebarStore((s) => s.setTotalUnreadConversations)
  const totalUnreadConversations = useSidebarStore((s) => s.totalUnreadConversations)
  const setConversation = useConversationStore((s) => s.setConversation)
  const { connected, send } = useStomp()
  const searchParams = useSearchParams()
  const conversationIdFromUrl = searchParams.get('c')

  const { data: conversationsRes } = useSWR(token ? ['conversations'] : null, () => getConversationsService(token!), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  useEffect(() => {
    if (conversationsRes?.isSuccess && conversationsRes.data) {
      setConversation(conversationsRes.data)
    }
  }, [conversationsRes, setConversation])

  useEffect(() => {
    if (conversationIdFromUrl) {
      setSelectedConversationId(conversationIdFromUrl)
    }
  }, [conversationIdFromUrl, setSelectedConversationId])

  useEffect(() => {
    if (selectedConversationId) return
    if (conversationIdFromUrl) return // Don't auto-select if URL has one (it might be loading)
    if (conversations.length <= 1) return
    const nextSelected = conversations.reduce<TConversationResponseForChatBoxDto | undefined>((best, cur) => {
      if (cur.unreadMessageCount !== 0 || !cur.lastMessageAt) return best
      if (!best) return cur

      return new Date(cur.lastMessageAt).getTime() > new Date(best.lastMessageAt!).getTime() ? cur : best
    }, undefined)
    if (nextSelected) {
      setSelectedConversationId(nextSelected.id)
    }
  }, [conversations, selectedConversationId, setSelectedConversationId, conversationIdFromUrl])

  useEffect(() => {
    if (!selectedConversationId || !authData) {
      document.title = 'Messages | Dabble'
      return
    }

    const conversation = getConversationById(selectedConversationId)
    if (!conversation) return

    if (conversation.name) {
      document.title = `Messages | ${conversation.name}`
    } else {
      document.title = 'Messages | Dabble'
    }
  }, [selectedConversationId, getConversationById, authData])

  const markConversationAsRead = () => {
    if (!connected || !selectedConversationId) return
    const conversation = getConversationById(selectedConversationId)
    if (!conversation || conversation.unreadMessageCount < 1) return
    send('/app/chat.markAsRead', { conversationId: selectedConversationId })
    setConversation({ ...conversation, unreadMessageCount: 0 })
    setTotalUnreadConversations(totalUnreadConversations - 1)
  }

  if (isLoading) return <Loading />

  return (
    <div className='grid h-[calc(100vh-110px)] grid-cols-12 items-start gap-4' onClick={markConversationAsRead}>
      <div className='bg-background col-span-3 h-full overflow-hidden rounded-2xl border shadow-sm'>
        <ConversationList />
      </div>
      <div className='bg-background col-span-9 h-full overflow-hidden rounded-2xl border shadow-sm'>
        <ChatView />
      </div>
    </div>
  )
}

const MessagePage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <MessagePageContent />
    </Suspense>
  )
}

export default MessagePage
