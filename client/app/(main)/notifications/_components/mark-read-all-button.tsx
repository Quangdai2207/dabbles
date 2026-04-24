'use client'

import { Button } from '@/components/ui/button'
import { CheckCheck } from 'lucide-react'
import { toast } from 'sonner' // Assuming sonner is used for toasts, or ui/use-toast
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import markReadAllService from '@/services/notification/mark-read-all'

import { useSidebarStore } from '@/lib/sidebar-store'

export default function MarkReadAllButton() {
  const { token } = useAuth()
  const router = useRouter()
  const { totalUnreadNotifications, setTotalUnreadNotifications } = useSidebarStore()

  const handleMarkAllRead = async () => {
    if (!token || totalUnreadNotifications === 0) return
    const res = await markReadAllService(token)
    if (res.isSuccess) {
      setTotalUnreadNotifications(0)
      toast.success('All notifications marked as read')
      router.refresh()
    } else {
      toast.error(res.errorMessage)
    }
  }

  return (
    <Button
      variant='ghost'
      size='sm'
      className='text-muted-foreground hover:text-foreground'
      onClick={handleMarkAllRead}
      disabled={!token || totalUnreadNotifications === 0}
    >
      <CheckCheck className='mr-2 size-4' />
      Mark all as read
    </Button>
  )
}
