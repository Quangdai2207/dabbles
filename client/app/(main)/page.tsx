import GetAuthToken from '@/lib/get-auth-token'
import getAllImagesService from '@/services/image/get-all-images'
import InfinitePostGrid from './_components/infinite-post-grid'
import { Camera } from 'lucide-react'
import DialogAddCategoriesForUser from './_components/DialogAddCategoriesForUser'

const Home = async () => {
  const token = await GetAuthToken()
  const res = await getAllImagesService(token, 0)
  const posts = res.data?.imageResponseDto || []
  const totalPage = res.data?.totalPage || 0

  const fetchNextPage = async (page: number) => {
    'use server'
    return getAllImagesService(token, page)
  }

  return (
    <div className='w-full p-4'>
      <DialogAddCategoriesForUser />
      <h1 className='sr-only'>Dabble - Share and Discover Creative Works</h1>
      {posts.length === 0 ? (
        <div className='border-border/50 bg-muted/20 flex flex-col items-center justify-center space-y-6 rounded-xl border-2 border-dashed py-32 text-center'>
          <div className='bg-background rounded-full p-4 shadow-sm'>
            <Camera className='text-muted-foreground/50 h-10 w-10' />
          </div>
          <div className='space-y-2'>
            <h3 className='text-xl font-bold tracking-tight'>No posts yet</h3>
            <p className='text-muted-foreground mx-auto max-w-sm text-sm'>Check back later for new updates.</p>
          </div>
        </div>
      ) : (
        <InfinitePostGrid
          initialPosts={posts}
          totalPage={totalPage}
          fetchNextPage={fetchNextPage}
          className='sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
        />
      )}
    </div>
  )
}

export default Home
