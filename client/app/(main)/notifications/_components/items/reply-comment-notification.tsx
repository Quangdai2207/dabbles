import Image from 'next/image'
import Link from 'next/link'
import BaseNotificationItem from '../base-notification-item'
import getImageUrl from '@/lib/get-images-url'

type Props = {
  notification: TReplyCommentNotification
}

export default function ReplyCommentNotification({ notification }: Props) {
  const { sender, content, imageId, imageUrl } = notification.comment

  return (
    <BaseNotificationItem
      notificationId={notification.id}
      sender={sender}
      isRead={notification.read}
      date={notification.notificationCreatedDate}
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
        <span className='text-primary font-semibold'>{sender.name}</span> replied to your comment: &quot;{content}&quot;
      </p>
    </BaseNotificationItem>
  )
}
