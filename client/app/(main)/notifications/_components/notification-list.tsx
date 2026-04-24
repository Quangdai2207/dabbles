'use client'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/providers/AuthProvider'
import { useStomp } from '@/providers/StompProvider'
import getAllNotificationService from '@/services/notification/get-all-notifications'
import { useCallback, useEffect, useRef, useState } from 'react'
import NotificationItem from './notification-item'

type Props = {
  notifications: TNotification[]
  totalPage: number
}

const NotificationList = ({ notifications: initialNotifications, totalPage: initialTotalPage }: Props) => {
  const [notifications, setNotifications] = useState<TNotification[]>(initialNotifications)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(page < initialTotalPage - 1)
  const [isLoading, setIsLoading] = useState(false)

  const { connected, subscribe } = useStomp()
  const { token } = useAuth()
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setNotifications(initialNotifications)
    setPage(0)
    setHasMore(0 < initialTotalPage - 1)
  }, [initialNotifications, initialTotalPage])

  const loadMoreNotifications = useCallback(async () => {
    if (isLoading || !hasMore || !token) return
    setIsLoading(true)

    try {
      const nextPage = page + 1
      const res = await getAllNotificationService(token, nextPage)

      if (res.isSuccess && res.data) {
        setNotifications((prev) => [...prev, ...res.data!.notifications])
        setPage(nextPage)
        setHasMore(nextPage < res.data!.totalPage - 1)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Failed to load more notifications:', error)
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }, [page, hasMore, isLoading, token])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreNotifications()
        }
      },
      { threshold: 1.0 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      observer.disconnect()
    }
  }, [hasMore, loadMoreNotifications])

  useEffect(() => {
    if (!connected) return

    const unsubscribe = subscribe('/user/queue/notification', (message) => {
      const data: TSocketNotification = JSON.parse(message.body)
      if (data && data.notification) {
        setNotifications((prev) => [data.notification, ...prev])
      }
    })

    return () => {
      unsubscribe()
    }
  }, [connected, subscribe])

  if (notifications.length === 0) {
    return (
      <div className='text-muted-foreground flex h-64 w-full flex-col items-center justify-center'>
        <p>No notifications yet</p>
      </div>
    )
  }

  return (
    <div className='bg-background ring-border mx-auto max-w-2xl overflow-hidden rounded-lg shadow-sm ring-1'>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
      <div ref={observerTarget} className='flex w-full items-center justify-center p-4'>
        {isLoading ? <Spinner /> : null}
        {!hasMore && notifications.length > 0 ? (
          <p className='text-muted-foreground text-xs'>No more notifications</p>
        ) : null}
      </div>
    </div>
  )
}
export default NotificationList
