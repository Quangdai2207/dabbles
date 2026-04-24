import { Skeleton } from '@/components/ui/skeleton'

const PostDialogSkeleton = () => {
  return (
    <>
      {/* Loading Skeleton */}
      <div className='relative flex h-[40vh] items-center justify-center overflow-hidden bg-zinc-900 lg:col-span-3 lg:h-full'>
        <Skeleton className='h-full w-full opacity-20' />
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent'></div>
        </div>
      </div>
      <div className='bg-background border-border/10 flex h-[55vh] flex-col border-l lg:col-span-2 lg:h-full'>
        <div className='border-border/40 flex shrink-0 items-center justify-between border-b p-4'>
          <div className='flex items-center gap-3'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <div className='flex flex-col gap-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-3 w-20' />
            </div>
          </div>
          <Skeleton className='h-8 w-8 rounded-full' />
        </div>
        <div className='flex-1 space-y-4 p-5'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[90%]' />
          <Skeleton className='h-4 w-[80%]' />
          <div className='space-y-2 pt-4'>
            <div className='flex gap-2'>
              <Skeleton className='h-8 w-8 rounded-full' />
              <div className='flex-1 space-y-1'>
                <Skeleton className='h-3 w-24' />
                <Skeleton className='h-3 w-full' />
              </div>
            </div>
            <div className='flex gap-2'>
              <Skeleton className='h-8 w-8 rounded-full' />
              <div className='flex-1 space-y-1'>
                <Skeleton className='h-3 w-24' />
                <Skeleton className='h-3 w-full' />
              </div>
            </div>
          </div>
        </div>
        <div className='border-border/40 shrink-0 border-t p-4'>
          <Skeleton className='h-12 w-full rounded-2xl' />
        </div>
      </div>
    </>
  )
}

export default PostDialogSkeleton
