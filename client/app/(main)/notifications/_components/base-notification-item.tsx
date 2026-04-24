'use client'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import getImageUrl from '@/lib/get-images-url'
import { useSidebarStore } from '@/lib/sidebar-store'
import { timeAgo } from '@/lib/time-convert'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import markReadService from '@/services/notification/mark-read'
import removeNotificationService from '@/services/notification/remove-notification'
import { Check, MoreHorizontal, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { toast } from 'sonner'

type Props = {
  notificationId: string
  sender?: TUserBasic
  date: string
  children?: ReactNode
  content?: ReactNode
  action?: ReactNode
  className?: string
  isRead?: boolean // Not in type but usually good
}

export default function BaseNotificationItem({
  notificationId,
  sender,
  date,
  children,
  content,
  action,
  className,
  isRead
}: Props) {
  const { token } = useAuth()
  const router = useRouter()
  const { setTotalUnreadNotifications } = useSidebarStore()

  const handleMarkRead = async () => {
    if (!token) return
    if (!isRead) {
      const res = await markReadService(notificationId, token)
      if (res.isSuccess) {
        setTotalUnreadNotifications((prev) => prev - 1)
        router.refresh()
      }
    } else return
  }

  const handleRemove = async () => {
    if (!token) return
    const res = await removeNotificationService(notificationId, token)
    if (res.isSuccess) {
      toast.success('Notification removed')
      router.refresh()
    } else {
      toast.error(res.errorMessage)
    }
  }
  return (
    <div
      className={cn(
        'group hover:bg-muted/50 dark:hover:bg-muted/10 flex w-full items-start gap-3 border-b p-4 transition-colors',
        '[contain-intrinsic-size:0_80px] [content-visibility:auto]',
        !isRead && 'bg-primary/5',
        className
      )}
      onClick={handleMarkRead}
    >
      <div className='shrink-0 pt-1'>
        {sender ? (
          <Link href={`/library/${sender.username}`}>
            <div className='bg-muted relative h-10 w-10 overflow-hidden rounded-full border'>
              <Image
                src={getImageUrl(sender.avatar) || '/assets/default-avatar.png'} // Fallback
                alt={sender.username}
                fill
                className='object-cover'
                unoptimized
              />
            </div>
          </Link>
        ) : (
          <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full'>
            <span className='text-xs font-bold'>Sys</span>
          </div>
        )}
      </div>
      <div className='flex flex-1 flex-col gap-1'>
        <div className='text-sm leading-snug'>{content || children}</div>
        <span className='text-muted-foreground text-xs' suppressHydrationWarning>
          About {timeAgo(date)} ago
        </span>
      </div>
      {action && <div className='shrink-0 pt-1'>{action}</div>}

      {!isRead ? (
        <div className='shrink-0 pt-3'>
          <div className='h-2.5 w-2.5 rounded-full bg-purple-600' />
        </div>
      ) : null}

      <div className='absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100 sm:static sm:opacity-100'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='text-muted-foreground h-8 w-8'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {!isRead ? (
              <DropdownMenuItem onClick={handleMarkRead}>
                <Check className='mr-2 h-4 w-4' />
                Mark as read
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              className='text-destructive focus:bg-destructive/10 focus:text-destructive'
              onClick={handleRemove}
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Remove notification
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
