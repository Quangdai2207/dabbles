import InfinitePostGrid from '@/app/(main)/_components/infinite-post-grid'
import { TabsContent } from '@/components/ui/tabs'
import getLikedImagesService from '@/services/image/get-liked-images'
import { Heart } from 'lucide-react'

const LikedContent = async ({ token }: { token: string | null | undefined }) => {
  const res = await getLikedImagesService(token, 0)
  const posts = res.data?.imageResponseDto || []
  const totalPage = res.data?.totalPage || 0

  const fetchNextPage = async (page: number) => {
    'use server'
    return getLikedImagesService(token, page)
  }

  return (
    <TabsContent value='liked' className='mt-6 min-h-[50vh]'>
      {posts.length === 0 ? (
        <div className='border-border/50 bg-muted/20 flex flex-col items-center justify-center space-y-6 rounded-xl border-2 border-dashed py-32 text-center'>
          <div className='bg-background rounded-full p-4 shadow-sm'>
            <Heart className='text-muted-foreground/50 h-10 w-10' />
          </div>
          <div className='space-y-2'>
            <h3 className='text-xl font-bold tracking-tight'>No liked posts yet</h3>
            <p className='text-muted-foreground mx-auto max-w-sm text-sm'>Browse and like posts to see them here.</p>
          </div>
        </div>
      ) : (
        <InfinitePostGrid initialPosts={posts} totalPage={totalPage} fetchNextPage={fetchNextPage} removeOnUnlike />
      )}
    </TabsContent>
  )
}

export default LikedContent
