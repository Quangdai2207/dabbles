import { Button } from '@/components/ui/button'
import Link from 'next/link'
import BaseNotificationItem from '../base-notification-item'

type Props = {
  notification: TFollowerNotification
}

export default function FollowerNotification({ notification }: Props) {
  return (
    <BaseNotificationItem
      notificationId={notification.id}
      isRead={notification.read}
      date={notification.notificationCreatedDate}
      sender={notification.sender}
      content={
        <div className='flex flex-col'>
          <span className='text-primary font-semibold'>{notification.sender.name}</span>
          <span>{notification.content || 'started following you.'}</span>
        </div>
      }
      action={
        <Link href={`/library/${notification.sender.username}`} onClick={(e) => e.stopPropagation()}>
          <Button size='sm' className='h-8'>
            View Library
          </Button>
        </Link>
      }
    />
  )
}
