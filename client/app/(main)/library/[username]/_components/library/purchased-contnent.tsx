import InfinitePostGrid from '@/app/(main)/_components/infinite-post-grid'
import { TabsContent } from '@/components/ui/tabs'
import getAllPurchasedImagesService from '@/services/image/get-all-purchased-images'
import { ShoppingBag } from 'lucide-react'

const PurchasedContent = async ({ token }: { token: string | null | undefined }) => {
  const res = await getAllPurchasedImagesService(token, 0)
  const posts = res.data?.imageResponseDto || []
  const totalPage = res.data?.totalPage || 0

  const fetchNextPage = async (page: number) => {
    'use server'
    return getAllPurchasedImagesService(token, page)
  }

  return (
    <TabsContent value='purchased' className='mt-6 min-h-[50vh]'>
      {posts.length === 0 ? (
        <div className='border-border/50 bg-muted/20 flex flex-col items-center justify-center space-y-6 rounded-xl border-2 border-dashed py-32 text-center'>
          <div className='bg-background rounded-full p-4 shadow-sm'>
            <ShoppingBag className='text-muted-foreground/50 h-10 w-10' />
          </div>
          <div className='space-y-2'>
            <h3 className='text-xl font-bold tracking-tight'>No purchased content</h3>
            <p className='text-muted-foreground mx-auto max-w-sm text-sm'>
              You haven&apos;t purchased any content yet. Explore the marketplace to find something amazing.
            </p>
          </div>
        </div>
      ) : (
        <InfinitePostGrid initialPosts={posts} totalPage={totalPage} fetchNextPage={fetchNextPage} />
      )}
    </TabsContent>
  )
}

export default PurchasedContent
