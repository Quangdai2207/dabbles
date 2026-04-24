'use client'

import { useSidebarStore } from '@/lib/sidebar-store'
import { useAuth } from '@/providers/AuthProvider'
import { useStomp } from '@/providers/StompProvider'
import totalUnreadConversationsService from '@/services/conversations/total-unread-conversations'
import totalUnreadNotificationService from '@/services/notification/total-unread-conversation'
import { useEffect } from 'react'

export const useSidebarLogic = () => {
  const { connected, subscribe } = useStomp()
  const { token } = useAuth()
  const setTotalUnreadConversations = useSidebarStore((s) => s.setTotalUnreadConversations)
  const setTotalUnreadNotifications = useSidebarStore((s) => s.setTotalUnreadNotifications)
  const totalUnreadConversations = useSidebarStore((s) => s.totalUnreadConversations)
  const totalUnreadNotifications = useSidebarStore((s) => s.totalUnreadNotifications)

  useEffect(() => {
    if (!token) return

    const fetchTotals = async () => {
      try {
        const [unreadConversationsRes, unreadNotificationsRes] = await Promise.all([
          totalUnreadConversationsService(token),
          totalUnreadNotificationService(token)
        ])

        setTotalUnreadConversations(unreadConversationsRes.data || 0)
        setTotalUnreadNotifications(unreadNotificationsRes.data || 0)
      } catch (error) {
        console.error('Failed to fetch totals', error)
      }
    }

    fetchTotals()
  }, [setTotalUnreadConversations, setTotalUnreadNotifications, token])

  useEffect(() => {
    if (!connected) return
    const subscription = subscribe('/user/queue/notification', (message) => {
      const data: TSocketNotification = JSON.parse(message.body)
      if (data) {
        setTotalUnreadNotifications(data.totalNotifications)
      }
    })
    return subscription
  }, [connected, setTotalUnreadNotifications, subscribe])

  return {
    totalUnreadConversations,
    totalUnreadNotifications
  }
}
