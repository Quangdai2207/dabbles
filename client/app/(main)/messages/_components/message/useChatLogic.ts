import { useConversationStore } from '@/lib/conversation-store'
import { useSidebarStore } from '@/lib/sidebar-store'
import { useAuth } from '@/providers/AuthProvider'
import { useStomp } from '@/providers/StompProvider'
import getMessagesConversation from '@/services/chat/get-message-conversation'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useCallback } from 'react'
import useSWR from 'swr'

export const useChatLogic = () => {
  const selectedConversationId = useConversationStore((s) => s.selectedConversationId)
  const getConversationById = useConversationStore((s) => s.getConversationById)
  const participantTemp = useConversationStore((s) => s.participantTemp)
  const setConversation = useConversationStore((s) => s.setConversation)
  const { authData, token } = useAuth()
  const { connected, subscribe, send } = useStomp()
  const setTotalUnreadConversations = useSidebarStore((s) => s.setTotalUnreadConversations)
  const totalUnreadConversations = useSidebarStore((s) => s.totalUnreadConversations)

  const searchParams = useSearchParams()
  const conversationIdFromUrl = searchParams.get('c')

  // Use URL param as primary source, fallback to store (though logic should keep them synced)
  const activeConversationId = conversationIdFromUrl || selectedConversationId

  // Derived State: Other User
  const storedConversation = useConversationStore(
    useCallback(
      (state) => state.conversations.find((c) => c.id === activeConversationId) || null,
      [activeConversationId]
    )
  )

  const otherUser = useMemo(() => {
    const conversation = storedConversation
    if (conversation) {
      return conversation.participants.find((p) => p.id !== authData?.id) ?? null
    }
    return participantTemp
  }, [storedConversation, authData?.id, participantTemp])

  // Data Fetching: Messages
  const {
    data: messagesRes,
    mutate,
    isLoading
  } = useSWR(
    activeConversationId && token ? ['messages', activeConversationId] : null,
    () => getMessagesConversation(activeConversationId!, token!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: Infinity
    }
  )

  const messages = messagesRes?.data || []

  // Real-time: Subscribe to new messages
  useEffect(() => {
    if (!connected || !activeConversationId) return
    const unsubscribe = subscribe(`/topic/conversation/${activeConversationId}`, (message) => {
      const data: TMessageConversation = JSON.parse(message.body)
      mutate(
        (c) => ({
          ...(c ?? { isSuccess: true, message: '', errorMessage: '', data: [] }),
          isSuccess: c?.isSuccess ?? true,
          data: [...(c?.data ?? []), data]
        }),
        { revalidate: false }
      )
    })
    return unsubscribe
  }, [connected, activeConversationId, subscribe, mutate])

  // Action: Mark as Read
  const markConversationAsRead = () => {
    if (!connected || !activeConversationId) return
    const conversation = getConversationById(activeConversationId)
    if (!conversation || conversation.unreadMessageCount === 0) return
    send('/app/chat.markAsRead', { conversationId: activeConversationId })
    setConversation({ ...conversation, unreadMessageCount: 0 })
    setTotalUnreadConversations(totalUnreadConversations - 1)
  }

  const blockStatus = storedConversation?.blockStatus ?? 'NONE'

  return {
    selectedConversationId: activeConversationId,
    otherUser,
    messages,
    isLoading,
    markConversationAsRead,
    mutate,
    token,
    blockStatus
  }
}
