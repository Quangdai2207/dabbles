import { NotificationType } from '@/constants/notification-type'
import CommentNotification from './items/comment-notification'
import ContactNotification from './items/contact-notification'
import FollowerNotification from './items/follower-notification'
import LikeNotification from './items/like-notification'
import ReplyCommentNotification from './items/reply-comment-notification'
import SaleImageNotification from './items/sale-image-notification'
import SubscriptionNotification from './items/subscription-notification'

type Props = {
  notification: TNotification
}

export default function NotificationItem({ notification }: Props) {
  // We use string literals that match the NotificationType enum values
  // This avoids importing the enum if it's only a type declaration
  switch (notification.type) {
    case NotificationType.SUBSCRIPTION:
      return <SubscriptionNotification notification={notification} />
    case NotificationType.ACCEPTED:
      return <ContactNotification notification={notification} />
    case NotificationType.COMMENT:
      return <CommentNotification notification={notification} />
    case NotificationType.LIKE:
      return <LikeNotification notification={notification} />
    case NotificationType.REPLY_COMMENT:
      return <ReplyCommentNotification notification={notification} />
    case NotificationType.SALE_IMAGE:
      return <SaleImageNotification notification={notification} />
    case NotificationType.FOLLOW_REQUEST:
      return <FollowerNotification notification={notification} />
    default:
      // Fallback for unknown types
      return null
  }
}
