import BaseNotificationItem from '../base-notification-item'

type Props = {
  notification: TContactNotification
}

export default function ContactNotification({ notification }: Props) {
  return (
    <BaseNotificationItem
      notificationId={notification.id}
      isRead={notification.read}
      date={notification.notificationCreatedDate}
      sender={notification.sender}
      content={
        <div className='flex flex-col'>
          <span className='text-primary font-semibold'>{notification.sender.name}</span>
          <span>{notification.content || 'accepted your request.'}</span>
        </div>
      }
    />
  )
}
