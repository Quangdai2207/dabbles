'use client'

import { memo, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import getImageUrl from '@/lib/get-images-url'
import { cn } from '@/lib/utils'
import { Heart, MessageCircle, Share2, Download } from 'lucide-react'
import NextImage from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
const PostDetailDialog = dynamic(() => import('./post-detail-dialog').then((mod) => mod.PostDetailDialog), {
  ssr: false
})
import { useAuth } from '@/providers/AuthProvider'
import { toast } from 'sonner'
import likeImagesById from '@/services/image/like-image-id'
import downloadImage from '@/lib/download-image'
import { FullScreenImageViewer } from '@/components/full-screen-image-viewer'

const PostCard = ({
  post,
  priority = false,
  onUnlike,
  onDelete
}: {
  post: TPostImage
  priority?: boolean
  onUnlike?: (() => void) | undefined
  onDelete?: (() => void) | undefined
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false)
  const { token } = useAuth()

  // Optimistic state pattern - null means use prop value
  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null)
  const [optimisticCount, setOptimisticCount] = useState<number | null>(null)

  // Derived values - use optimistic if set, otherwise use props
  const isLiked = optimisticLiked ?? post.liked
  const likeCount = optimisticCount ?? post.likeCount

  const handleOpenViewDetails = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      if (post.deleted) {
        setIsFullScreenOpen(true)
      } else {
        setIsDialogOpen(true)
      }
    },
    [post.deleted]
  )

  const handleLikeImage = useCallback(async () => {
    if (!token) {
      toast.error('You need to be logged in to like posts')
      return
    }

    const newLikedState = !isLiked
    const currentCount = likeCount

    // Optimistic UI update (Toggle Icon/Count immediately)
    setOptimisticLiked(newLikedState)
    setOptimisticCount(newLikedState ? currentCount + 1 : currentCount - 1)

    try {
      const res = await likeImagesById(post.id, token)

      if (res.isSuccess) {
        // If unliking and we have a removal callback, call it NOW after success
        if (!newLikedState && onUnlike) {
          onUnlike()
        }
      } else {
        // Revert on failure - reset to null to use prop values
        setOptimisticLiked(null)
        setOptimisticCount(null)
        toast.error(res.errorMessage)
      }
    } catch {
      // Revert on error - reset to null to use prop values
      setOptimisticLiked(null)
      setOptimisticCount(null)
      toast.error('Something went wrong')
    }
  }, [token, isLiked, likeCount, post.id, onUnlike])

  const handleDownload = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      downloadImage(getImageUrl(post.imageUrls.original))
    },
    [post]
  )

  return (
    <>
      <PostDetailDialog post={post} isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} onDelete={onDelete} />
      <FullScreenImageViewer
        isOpen={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
        src={getImageUrl(post.imageUrls.original)}
        alt={post.creator.name}
      />
      <div className='group/card relative break-inside-avoid'>
        {/* Card Container */}
        <div
          className='bg-muted/20 focus-visible:ring-ring relative overflow-hidden rounded-2xl shadow-sm transition-all duration-500 [contain-intrinsic-size:0_400px] [content-visibility:auto] hover:shadow-xl focus-visible:ring-2 focus-visible:outline-none'
          onClick={handleOpenViewDetails}
          onContextMenu={(e) => e.preventDefault()}
          role='button'
          tabIndex={0}
          aria-label={`View details of post by ${post.creator.name}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleOpenViewDetails(e as unknown as React.MouseEvent)
            }
          }}
        >
          {/* Image Area */}
          <div className='relative aspect-3/4 cursor-pointer overflow-hidden'>
            <NextImage
              src={getImageUrl(post.imageUrls.w1080)}
              alt={`Post by ${post.creator.name}`}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              className='object-cover transition-transform duration-700 ease-out will-change-transform group-hover/card:scale-105'
              priority={priority}
            />
            {/* Premium Gradient Overlay - Only visible on hover */}
            <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 ease-in-out group-hover/card:opacity-100' />

            {/* Top Actions */}
            <div className='absolute inset-x-3 top-3 flex -translate-y-2 items-start justify-between opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100'>
              {!post.deleted ? (
                <div
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-lg backdrop-blur-xl transition-all',
                    post.price > 0
                      ? 'border-amber-500/30 bg-black/60 text-amber-100'
                      : 'border-white/30 bg-black/60 text-white' // Increased border contrast
                  )}
                >
                  <span className='text-xs font-bold tracking-wide'>
                    {post.price > 0
                      ? new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0
                        }).format(post.price)
                      : 'Free'}
                  </span>
                </div>
              ) : (
                <div />
              )}

              <div className='flex gap-2'>
                {post.deleted ? (
                  <Button
                    size='icon'
                    variant='secondary'
                    className='focus-visible:ring-ring h-10 w-10 rounded-full bg-white/90 text-zinc-700 shadow-sm backdrop-blur-md transition-transform hover:scale-105 hover:bg-white focus-visible:ring-2 focus-visible:outline-none active:scale-95 dark:bg-black/60 dark:text-white dark:hover:bg-black/80'
                    onClick={handleDownload}
                    aria-label='Download image'
                  >
                    <Download className='h-5 w-5' />
                  </Button>
                ) : (
                  <>
                    <Button
                      size='icon'
                      variant='secondary'
                      className='focus-visible:ring-ring h-10 w-10 rounded-full bg-white/90 text-zinc-700 shadow-sm backdrop-blur-md transition-transform hover:scale-105 hover:bg-white focus-visible:ring-2 focus-visible:outline-none active:scale-95 dark:bg-black/60 dark:text-white dark:hover:bg-black/80' // Increased to 40px
                      onClick={(e) => e.stopPropagation()}
                      aria-label='Share post' // Added aria-label
                    >
                      <Share2 className='h-5 w-5' />
                    </Button>
                    <Button
                      size='icon'
                      variant='secondary'
                      className='focus-visible:ring-ring h-10 w-10 rounded-full bg-white/90 text-red-500 shadow-sm backdrop-blur-md transition-transform hover:scale-105 hover:bg-white focus-visible:ring-2 focus-visible:outline-none active:scale-95 dark:bg-black/60 dark:hover:bg-black/80' // Increased to 40px
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLikeImage()
                      }}
                      aria-label={isLiked ? 'Unlike post' : 'Like post'} // Dynamic aria-label
                    >
                      <Heart className={cn('h-5 w-5', isLiked ? 'fill-current' : '')} />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className='absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100'>
              <div className='flex items-end justify-between gap-2'>
                {/* User Info */}
                <Link
                  href={`/library/${post.creator.username}`}
                  className='group/user focus-visible:ring-ring flex items-center gap-2 overflow-hidden rounded-full focus-visible:ring-2 focus-visible:outline-none'
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className='relative h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-white/90 shadow-sm transition-transform group-hover/user:scale-105'>
                    {post.creator.avatar ? (
                      <NextImage
                        src={getImageUrl(post.creator.avatar)}
                        alt={post.creator.name}
                        fill
                        className='object-cover'
                        unoptimized
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center bg-zinc-100 text-[10px] font-bold text-zinc-500 uppercase'>
                        {post.creator.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className='flex flex-col text-white drop-shadow-md'>
                    <span className='truncate text-sm leading-none font-bold tracking-tight'>{post.creator.name}</span>
                    <span className='truncate text-[10px] font-medium opacity-80'>@{post.creator.username}</span>
                  </div>
                </Link>

                {/* Micro Stats */}
                <div className='flex items-center gap-3 text-xs font-medium text-white/90 drop-shadow-md'>
                  <div className='flex items-center gap-1'>
                    <Heart className='h-4 w-4 fill-white/20' />
                    <span>{likeCount}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <MessageCircle className='h-4 w-4 fill-white/20' />
                    <span>{post.commentCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(PostCard)
