import getAllImagesService from '@/services/image/get-all-images'
import PublicInfinitePostGrid from '../../_components/public-infinite-post-grid'
import { Camera } from 'lucide-react'

type SearchPageProps = {
  searchParams: Promise<{
    category?: string
  }>
}

const PublicSearchPage = async ({ searchParams }: SearchPageProps) => {
  const { category } = await searchParams
  const res = await getAllImagesService(null, 0, category)
  const posts = res.data?.imageResponseDto || []
  const totalPage = res.data?.totalPage || 0

  const fetchNextPage = async (page: number) => {
    'use server'
    return getAllImagesService(null, page, category)
  }

  return (
    <div className='w-full p-4'>
      <div className='container mx-auto'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold tracking-tight'>{category ? `Results for "${category}"` : 'Search'}</h1>
          <p className='text-muted-foreground mt-2'>
            {category ? `Explore images in the ${category} category` : 'Browse all images'}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className='border-border/50 bg-muted/20 flex flex-col items-center justify-center space-y-6 rounded-xl border-2 border-dashed py-32 text-center'>
            <div className='bg-background rounded-full p-4 shadow-sm'>
              <Camera className='text-muted-foreground/50 h-10 w-10' />
            </div>
            <div className='space-y-2'>
              <h3 className='text-xl font-bold tracking-tight'>No posts found</h3>
              <p className='text-muted-foreground mx-auto max-w-sm text-sm'>
                {category ? `No results for category "${category}"` : 'Try searching for something else.'}
              </p>
            </div>
          </div>
        ) : (
          <PublicInfinitePostGrid
            key={category}
            initialPosts={posts}
            totalPage={totalPage}
            fetchNextPage={fetchNextPage}
            className='sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
          />
        )}
      </div>
    </div>
  )
}

export default PublicSearchPage
