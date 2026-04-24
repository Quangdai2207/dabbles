import Image from 'next/image'
import Link from 'next/link'
import BaseNotificationItem from '../base-notification-item'
import getImageUrl from '@/lib/get-images-url'

type Props = {
  notification: TSaleImageNotification
}

export default function SaleImageNotification({ notification }: Props) {
  return (
    <BaseNotificationItem
      notificationId={notification.id}
      isRead={notification.read}
      date={notification.notificationCreatedDate}
      sender={notification.sender}
      action={
        notification.image ? (
          <Link
            href={`/post/${notification.imageId}`}
            className='relative block h-10 w-10 overflow-hidden rounded-md border sm:h-12 sm:w-12'
          >
            <Image src={getImageUrl(notification.image)} alt='Sold Image' fill className='object-cover' unoptimized />
          </Link>
        ) : null
      }
    >
      <p>
        <span className='text-primary font-semibold'>{notification.sender.name}</span> purchased your image!
      </p>
    </BaseNotificationItem>
  )
}
