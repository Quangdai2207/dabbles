'use client'

import { Button } from '@/components/ui/button'
import getImageUrl from '@/lib/get-images-url'
import { cn } from '@/lib/utils'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

const PublicPostDetailDialog = dynamic(
  () => import('./public-post-detail-dialog').then((mod) => mod.PublicPostDetailDialog),
  {
    ssr: false
  }
)

const PublicPostCard = ({ post, priority = false }: { post: TPostImage; priority?: boolean }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsDialogOpen(true)
  }

  const handleLoginRequired = (action: string) => {
    toast.info(`Please log in to ${action}`, {
      action: {
        label: 'Log in',
        onClick: () => (window.location.href = '/login')
      }
    })
  }

  return (
    <>
      <PublicPostDetailDialog post={post} isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className='group/card relative break-inside-avoid'>
        {/* Card Container */}
        <div
          className='bg-muted/20 focus-visible:ring-ring relative overflow-hidden rounded-2xl shadow-sm transition-all duration-500 hover:shadow-xl focus-visible:ring-2 focus-visible:outline-none'
          onClick={handleOpenViewDetails}
          onContextMenu={(e) => e.preventDefault()}
          tabIndex={0}
          role='button'
          aria-label={`View details of post by ${post.creator.name}`}
        >
          {/* Image Area */}
          <div className='relative aspect-3/4 cursor-pointer overflow-hidden'>
            <Image
              src={getImageUrl(post.imageUrls.original)}
              alt={`Post by ${post.creator.name}`}
              fill
              className='object-cover transition-transform duration-700 ease-out will-change-transform group-hover/card:scale-105'
              priority={priority}
              unoptimized
            />
            {/* Premium Gradient Overlay - Only visible on hover */}
            <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 ease-in-out group-hover/card:opacity-100' />

            {/* Top Actions */}
            {/* Top Actions */}
            <div className='absolute inset-x-3 top-3 flex -translate-y-2 items-start justify-between opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100'>
              <div
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-lg backdrop-blur-xl transition-all',
                  post.price > 0
                    ? 'border-amber-500/30 bg-black/60 text-amber-100'
                    : 'border-white/30 bg-black/60 text-white' // Increased border contrast
                )}
              >
                <span className='text-xs font-bold tracking-wide'>
                  {post.price > 0 ? `$${post.price.toLocaleString()}` : 'Free'}
                </span>
              </div>

              <div className='flex gap-2'>
                <Button
                  size='icon'
                  variant='secondary'
                  className='focus-visible:ring-ring h-10 w-10 rounded-full bg-white/90 text-zinc-700 shadow-sm backdrop-blur-md transition-transform hover:scale-105 hover:bg-white focus-visible:ring-2 focus-visible:outline-none active:scale-95 dark:bg-black/60 dark:text-white dark:hover:bg-black/80' // Increased size to h-10 w-10
                  onClick={(e) => e.stopPropagation()}
                  aria-label='Share post' // Added aria-label
                >
                  <Share2 className='h-5 w-5' /> {/* Slightly larger icon */}
                </Button>
                <Button
                  size='icon'
                  variant='secondary'
                  className='focus-visible:ring-ring h-10 w-10 rounded-full bg-white/90 text-red-500 shadow-sm backdrop-blur-md transition-transform hover:scale-105 hover:bg-white focus-visible:ring-2 focus-visible:outline-none active:scale-95 dark:bg-black/60 dark:hover:bg-black/80' // Increased size to h-10 w-10
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLoginRequired('like posts')
                  }}
                  aria-label='Like post' // Added aria-label
                >
                  <Heart className={cn('h-5 w-5', post.liked ? 'fill-current' : '')} /> {/* Slightly larger icon */}
                </Button>
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className='absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100'>
              <div className='flex items-end justify-between gap-2'>
                {/* User Info */}
                <Link
                  href={`/explore/library/${post.creator.username}`}
                  className='group/user focus-visible:ring-ring flex items-center gap-2 overflow-hidden rounded-full focus-visible:ring-2 focus-visible:outline-none'
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className='relative h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-white/90 shadow-sm transition-transform group-hover/user:scale-105'>
                    {post.creator.avatar ? (
                      <Image
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
                    <span>{post.likeCount}</span>
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

export default PublicPostCard
