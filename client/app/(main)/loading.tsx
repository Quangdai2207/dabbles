import { Loader2 } from 'lucide-react'

const Loading = () => {
  return (
    <div className='bg-background/50 flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-4 backdrop-blur-sm'>
      <div className='relative flex items-center justify-center'>
        <div className='bg-primary/20 absolute h-12 w-12 animate-ping rounded-full delay-300 duration-1000'></div>
        <div className='bg-primary/30 absolute h-8 w-8 animate-ping rounded-full duration-700'></div>
        <div className='animate-spin'>
          <Loader2 className='text-primary relative h-10 w-10' />
        </div>
      </div>
      <p className='text-muted-foreground animate-pulse text-sm font-medium'>Loading your experience...</p>
    </div>
  )
}

export default Loading
