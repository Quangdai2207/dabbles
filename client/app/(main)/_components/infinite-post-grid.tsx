'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import PostCard from '@/app/(main)/_components/post-card'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner' // Assuming sonner is used for toasts
import { cn } from '@/lib/utils'

interface InfinitePostGridProps {
  initialPosts: TPostImage[]
  totalPage: number
  fetchNextPage: (page: number) => Promise<TResponseStatusObject<TPaginationPostImage>>
  className?: string
  removeOnUnlike?: boolean
}

const InfinitePostGrid = ({
  initialPosts,
  totalPage: initialTotalPage,
  fetchNextPage,
  className,
  removeOnUnlike = false
}: InfinitePostGridProps) => {
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
      toast.error('Could not load more posts. Check your connection or try again.')
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

  const handleRemovePost = (postId: string) => {
    setPosts((current) => current.filter((p) => p.id !== postId))
  }

  return (
    <div className='space-y-8 pb-8'>
      <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4', className)}>
        {posts.map((post, index) => (
          <PostCard
            key={`${post.id}-${index}`}
            post={post}
            priority={index < 4}
            onUnlike={removeOnUnlike ? () => handleRemovePost(post.id) : undefined}
            onDelete={() => handleRemovePost(post.id)}
          />
        ))}
      </div>

      {/* Loading Indicator / Observer Target */}
      <div ref={observerTarget} className='flex w-full items-center justify-center py-4'>
        {isLoading && (
          <div className='text-muted-foreground flex flex-col items-center gap-2 text-sm'>
            <div className='animate-spin'>
              <Loader2 className='h-6 w-6' />
            </div>
            <span>Loading more…</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default InfinitePostGrid
