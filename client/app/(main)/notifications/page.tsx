import GetAuthToken from '@/lib/get-auth-token'
import getAllNotificationService from '@/services/notification/get-all-notifications'
import { redirect } from 'next/navigation'
import NotificationList from './_components/notification-list'
import MarkReadAllButton from './_components/mark-read-all-button'

import { BellOff } from 'lucide-react'

const NotificationsPage = async () => {
  const token = await GetAuthToken()
  if (!token) {
    redirect('/login')
  }

  const response = await getAllNotificationService(token)
  if (!response.isSuccess) {
    return (
      <div className='flex h-[50vh] flex-col items-center justify-center gap-4 text-center'>
        <div className='bg-muted flex h-20 w-20 items-center justify-center rounded-full'>
          <BellOff className='text-muted-foreground h-10 w-10' />
        </div>
        <p className='text-muted-foreground text-lg font-medium'>{response.errorMessage}</p>
      </div>
    )
  }

  const notifications = response.data?.notifications || []
  const totalPage = response.data?.totalPage || 0
  console.log(notifications)
  return (
    <div className='container mx-auto max-w-2xl px-4 py-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Notifications</h1>
        <MarkReadAllButton />
      </div>
      <NotificationList notifications={notifications} totalPage={totalPage} />
    </div>
  )
}

export default NotificationsPage
