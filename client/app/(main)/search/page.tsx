import GetAuthToken from '@/lib/get-auth-token'
import getAllImagesService from '@/services/image/get-all-images'
import InfinitePostGrid from '../_components/infinite-post-grid'
import { Camera, X } from 'lucide-react'
import Link from 'next/link'

type SearchPageProps = {
  searchParams: Promise<{
    category?: string
    keyword?: string
  }>
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const [resolvedSearchParams, token] = await Promise.all([searchParams, GetAuthToken()])
  const { category, keyword } = resolvedSearchParams
  const res = await getAllImagesService(token, 0, category, keyword)
  const posts = res.data?.imageResponseDto || []
  const totalPage = res.data?.totalPage || 0

  const fetchNextPage = async (page: number) => {
    'use server'
    return getAllImagesService(token, page, category, keyword)
  }

  return (
    <div className='w-full p-4'>
      {keyword || category ? (
        <div className='mb-8 flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <div className='flex flex-col gap-1'>
              <span className='text-muted-foreground text-sm font-medium tracking-wider uppercase'>
                {keyword ? 'Search Results' : 'Browsing Category'}
              </span>
              <h2 className='text-3xl font-bold tracking-tight md:text-4xl'>
                <span className='bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent capitalize dark:from-purple-400 dark:to-blue-400'>
                  {keyword || category?.replace(/-/g, ' ')}
                </span>
              </h2>
            </div>
            <Link
              href='/'
              className='bg-secondary hover:bg-destructive/10 hover:text-destructive flex h-10 w-10 items-center justify-center rounded-full transition-colors'
              title='Clear search'
            >
              <X className='h-5 w-5' />
            </Link>
          </div>
        </div>
      ) : null}
      {posts.length === 0 ? (
        <div className='border-border/50 bg-muted/20 flex flex-col items-center justify-center space-y-6 rounded-xl border-2 border-dashed py-32 text-center'>
          <div className='bg-background rounded-full p-4 shadow-sm'>
            <Camera className='text-muted-foreground/50 h-10 w-10' />
          </div>
          <div className='space-y-2'>
            <h3 className='text-xl font-bold tracking-tight'>No posts found</h3>
            <p className='text-muted-foreground mx-auto max-w-sm text-sm'>
              {keyword
                ? `No results for keyword "${keyword}"`
                : category
                  ? `No results for category "${category}"`
                  : 'Try searching for something else.'}
            </p>
          </div>
        </div>
      ) : (
        <InfinitePostGrid
          key={`${category || ''}-${keyword || ''}`}
          initialPosts={posts}
          totalPage={totalPage}
          fetchNextPage={fetchNextPage}
          className='sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
        />
      )}
    </div>
  )
}

export default SearchPage
