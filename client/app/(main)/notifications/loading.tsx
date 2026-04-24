import { Skeleton } from '@/components/ui/skeleton'

export default function NotificationsLoading() {
  return (
    <div className='container mx-auto max-w-2xl px-4 py-6'>
      <div className='mb-6 flex items-center justify-between'>
        <Skeleton className='h-8 w-40' /> {/* Title */}
        <Skeleton className='h-9 w-32' /> {/* Mark as read button */}
      </div>

      <div className='bg-background ring-border mx-auto max-w-2xl overflow-hidden rounded-lg shadow-sm ring-1'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className='flex w-full items-start gap-3 border-b p-4'>
            {/* Avatar Skeleton */}
            <Skeleton className='h-10 w-10 shrink-0 rounded-full' />

            {/* Content Skeleton */}
            <div className='flex flex-1 flex-col gap-2'>
              <Skeleton className='h-4 w-full max-w-[300px]' />
              <Skeleton className='h-3 w-24' />
            </div>

            {/* Action Image Skeleton (Simulating valid action presence randomly or just placeholder) */}
            <Skeleton className='h-10 w-10 shrink-0 rounded-md sm:h-12 sm:w-12' />
          </div>
        ))}
      </div>
    </div>
  )
}
