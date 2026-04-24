import Image from 'next/image'
import Link from 'next/link'
import BaseNotificationItem from '../base-notification-item'
import getImageUrl from '@/lib/get-images-url'

type Props = {
  notification: TCommentNotification
}

export default function CommentNotification({ notification }: Props) {
  const { sender, content, imageId, imageUrl } = notification.comment

  return (
    <BaseNotificationItem
      notificationId={notification.id}
      isRead={notification.read}
      date={notification.notificationCreatedDate}
      sender={sender}
      action={
        imageUrl ? (
          <Link
            href={`/post/${imageId}`}
            className='relative block h-10 w-10 overflow-hidden rounded-md border sm:h-12 sm:w-12'
          >
            <Image src={getImageUrl(imageUrl)} alt='Post' fill className='object-cover' unoptimized />
          </Link>
        ) : null
      }
    >
      <p>
        <span className='text-primary font-semibold'>{sender.name}</span> commented: &quot;{content}
        &quot;
      </p>
    </BaseNotificationItem>
  )
}
