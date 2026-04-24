'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import PublicPostCard from '@/app/(public)/_components/public-post-card'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface PublicInfinitePostGridProps {
  initialPosts: TPostImage[]
  totalPage: number
  fetchNextPage: (page: number) => Promise<TResponseStatusObject<TPaginationPostImage>>
  className?: string
}

const PublicInfinitePostGrid = ({
  initialPosts,
  totalPage: initialTotalPage,
  fetchNextPage,
  className
}: PublicInfinitePostGridProps) => {
  const [posts, setPosts] = useState<TPostImage[]>(initialPosts)
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(page < initialTotalPage - 1)
  const observerTarget = useRef<HTMLDivElement>(null)

  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const nextPage = page + 1
      const res = await fetchNextPage(nextPage)

      if (res.isSuccess && res.data) {
        setPosts((prev) => [...prev, ...res.data!.imageResponseDto])
        setPage(nextPage)
        setHasMore(nextPage < res.data.totalPage)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Failed to load more posts', error)
      toast.error('Failed to load more posts')
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, page, fetchNextPage])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMorePosts()
        }
      },
      { threshold: 1.0 }
    )

    const currentRef = observerTarget.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      observer.disconnect()
    }
  }, [loadMorePosts, hasMore, isLoading])

  return (
    <div className='space-y-8 pb-8'>
      <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4', className)}>
        {posts.map((post, index) => (
          <PublicPostCard key={`${post.id}-${index}`} post={post} priority={index < 4} />
        ))}
      </div>

      {/* Loading Indicator / Observer Target */}
      <div ref={observerTarget} className='flex w-full items-center justify-center py-4'>
        {isLoading && (
          <div className='text-muted-foreground flex flex-col items-center gap-2 text-sm'>
            <div className='animate-spin'>
              <Loader2 className='h-6 w-6' />
            </div>
            <span>Loading more...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicInfinitePostGrid
