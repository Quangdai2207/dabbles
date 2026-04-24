import PublicInfinitePostGrid from '@/app/(public)/_components/public-infinite-post-grid'
import getImagesByUserIdService from '@/services/image/get-images-by-userId'
import { Camera } from 'lucide-react'

const PublicLibraryContent = async ({ username }: { username: string }) => {
  const res = await getImagesByUserIdService(username, null, 0)
  const posts = res.data?.imageResponseDto || []
  const totalPage = res.data?.totalPage || 0

  const fetchNextPage = async (page: number) => {
    'use server'
    return getImagesByUserIdService(username, null, page)
  }

  return (
    <div className='w-full'>
      <div className='mb-6 border-b pb-4'>
        <h3 className='text-xl font-bold'>Posts</h3>
      </div>

      {posts.length === 0 ? (
        <div className='border-border/50 bg-muted/20 flex flex-col items-center justify-center space-y-6 rounded-xl border-2 border-dashed py-32 text-center'>
          <div className='bg-background rounded-full p-4 shadow-sm'>
            <Camera className='text-muted-foreground/50 h-10 w-10' />
          </div>
          <div className='space-y-2'>
            <h3 className='text-xl font-bold tracking-tight'>No posts yet</h3>
            <p className='text-muted-foreground mx-auto max-w-sm text-sm'>
              This user hasn&apos;t shared any images yet.
            </p>
          </div>
        </div>
      ) : (
        <PublicInfinitePostGrid initialPosts={posts} totalPage={totalPage} fetchNextPage={fetchNextPage} />
      )}
    </div>
  )
}

export default PublicLibraryContent
