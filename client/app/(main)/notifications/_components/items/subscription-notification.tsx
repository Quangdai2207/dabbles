import BaseNotificationItem from '../base-notification-item'

type Props = {
  notification: TSubscriptionNotification
}

export default function SubscriptionNotification({ notification }: Props) {
  return (
    <BaseNotificationItem
      notificationId={notification.id}
      isRead={notification.read}
      date={notification.notificationCreatedDate}
    >
      <p>
        <span className='text-primary font-semibold'>System:</span> {notification.content}
      </p>
    </BaseNotificationItem>
  )
}
