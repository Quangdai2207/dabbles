'use client'

import { FullScreenImageViewer } from '@/components/full-screen-image-viewer'
import PublicComments from '@/app/(public)/_components/public-comments'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import getImageUrl from '@/lib/get-images-url'
import { cn } from '@/lib/utils'
import getCommentImageById from '@/services/image/get-comment-image-id'
import getImagesByIdService from '@/services/image/get-images-by-id'
import { Download, Heart, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
import { timeAgo } from '@/lib/time-convert'
import PostDialogSkeleton from '@/app/(main)/_components/post-dialog/post-dialog-skeleton'

interface PublicPostDetailDialogProps {
  post: TPostImage
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const fetcherDetailsImage = async ([id]: [string]) => {
  const res = await getImagesByIdService(id, null)
  if (!res.isSuccess) throw new Error('Failed to load image details')
  return res.data
}

const fetcherDataComments = async (imageId: string) => {
  const res = await getCommentImageById(imageId)
  if (!res.isSuccess) throw new Error('Failed to load image comments')
  return res.data
}

export function PublicPostDetailDialog({ post, isOpen, onOpenChange }: PublicPostDetailDialogProps) {
  const [isFullScreen, setIsFullScreen] = useState(false)

  const { data: details, isLoading: isDetailsLoading } = useSWR(isOpen ? [post.id] : null, fetcherDetailsImage, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  const { data: comments, isLoading: isCommentsLoading } = useSWR(isOpen ? post.id : null, fetcherDataComments, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  const isLoading = isDetailsLoading || isCommentsLoading

  const handleLoginRequired = (action: string) => {
    toast.info(`Please log in to ${action}`, {
      action: {
        label: 'Log in',
        onClick: () => (window.location.href = '/login')
      }
    })
  }

  // Use details if available, otherwise fallback to basic post info
  const displayPost = details || {
    ...post,
    description: '',
    categories: [],
    liked: false
  }
  const imageUrl = getImageUrl(displayPost.imageUrls.w1080)

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className='flex h-[95vh] w-[95vw] max-w-[1400px] flex-col gap-0 overflow-hidden rounded-xl border-0 bg-black/95 p-0 shadow-2xl lg:grid lg:grid-cols-5'>
          <div className='hidden'>
            <DialogTitle>Image Details</DialogTitle>
            <DialogDescription className='sr-only'>
              Detailed view of the post by {post.creator.name}, including comments and interactions.
            </DialogDescription>
          </div>
          {isLoading ? (
            <PostDialogSkeleton />
          ) : (
            <>
              {/* Left Side: Image */}
              <div className='relative flex h-[40vh] items-center justify-center overflow-hidden bg-black/40 backdrop-blur-3xl lg:col-span-3 lg:h-full'>
                {/* Main Image Container */}
                <div
                  className='relative flex h-full w-full cursor-zoom-in items-center justify-center p-4 transition-transform hover:scale-[1.01] active:scale-[0.99] lg:p-8'
                  onClick={() => setIsFullScreen(true)}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <div className='absolute inset-0 z-0'>
                    <Image
                      src={imageUrl}
                      alt=''
                      fill
                      className='scale-150 object-cover opacity-30 blur-[100px]'
                      priority
                      unoptimized
                    />
                  </div>

                  <div className='relative z-10 max-h-full max-w-full overflow-hidden rounded-lg shadow-2xl transition-transform duration-300 ease-out'>
                    <Image
                      src={imageUrl}
                      alt={displayPost.creator.name}
                      width={1200}
                      height={1200}
                      className='h-auto max-h-[calc(40vh-32px)] w-auto object-contain lg:max-h-[calc(95vh-64px)]'
                      priority
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              {/* Right Side: Details */}
              <div className='bg-background/95 lg:bg-background/95 border-border/10 flex h-[55vh] flex-col border-l backdrop-blur-xl lg:col-span-2 lg:h-full'>
                {/* Header */}
                <div className='border-border/40 bg-background/50 z-20 flex shrink-0 items-center justify-between border-b p-4 backdrop-blur-md'>
                  <div className='flex items-center gap-3'>
                    <Link href={`/explore/library/${displayPost.creator.username}`} onClick={() => onOpenChange(false)}>
                      <div className='ring-primary/10 relative h-10 w-10 overflow-hidden rounded-full ring-2'>
                        {displayPost.creator.avatar ? (
                          <Image
                            src={getImageUrl(displayPost.creator.avatar)}
                            alt={displayPost.creator.name}
                            fill
                            className='object-cover'
                            unoptimized
                          />
                        ) : (
                          <div className='bg-muted text-muted-foreground flex h-full w-full items-center justify-center'>
                            {displayPost.creator.name[0]}
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className='flex flex-col gap-1 leading-none'>
                      <div className='flex items-center gap-2'>
                        <Link
                          href={`/explore/library/${displayPost.creator.username}`}
                          onClick={() => onOpenChange(false)}
                          className='text-sm font-bold hover:underline'
                        >
                          {displayPost.creator.name}
                        </Link>
                        <span className='text-muted-foreground text-xs'>{timeAgo(displayPost.createdDate)}</span>
                      </div>
                      <span className='text-muted-foreground text-xs'>@{displayPost.creator.username}</span>
                    </div>
                  </div>
                </div>

                {/* Scrollable Content */}
                <ScrollArea className='w-full flex-1'>
                  <div className='flex flex-col gap-4 p-5'>
                    {/* Caption & Tags */}
                    <div className='border-border/40 space-y-3 border-b pb-4'>
                      {details?.description && (
                        <div className='text-foreground/90 text-[15px] leading-relaxed whitespace-pre-wrap'>
                          {details.description}
                        </div>
                      )}

                      {details?.categories && details?.categories?.length > 0 && (
                        <div className='flex flex-wrap gap-2 pt-1'>
                          {details.categories.map((cat) => (
                            <Link key={cat.name} href={`/explore/search?category=${cat.slug}`}>
                              <Badge
                                variant='secondary'
                                className='hover:bg-secondary/80 cursor-pointer rounded-md px-2 py-0.5 text-xs font-medium transition-colors'
                              >
                                #{cat.name}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Stats Row */}
                    <div className='border-border/40 flex w-full items-center justify-between gap-4 border-b py-2'>
                      <div className='flex items-center gap-4'>
                        <div
                          className='group flex cursor-pointer items-center gap-1'
                          onClick={() => handleLoginRequired('like posts')}
                        >
                          <Heart
                            className={cn(
                              'h-6 w-6 transition-all duration-300 group-active:scale-90',
                              displayPost.liked
                                ? 'fill-red-500 text-red-500'
                                : 'text-muted-foreground group-hover:text-red-500'
                            )}
                          />
                          <span className='text-sm font-medium'>{displayPost.likeCount} likes</span>
                        </div>
                        <div className='text-muted-foreground flex items-center gap-1'>
                          <MessageCircle className='h-6 w-6' />
                          <span className='text-sm font-medium'>{displayPost.commentCount} comments</span>
                        </div>
                      </div>
                      <div className='flex gap-1'>
                        <Button
                          size='icon'
                          className='mr-2 rounded-full'
                          onClick={() => handleLoginRequired('download images')}
                        >
                          <Download className='h-5 w-5' />
                        </Button>
                        {post.price !== undefined &&
                          post.price !== null &&
                          (post.price === 0 ? (
                            <Button
                              variant='secondary'
                              className='mr-2 cursor-default rounded-full border border-green-200 bg-green-100 px-3 font-bold text-green-600 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400'
                            >
                              Free
                            </Button>
                          ) : (
                            <Button
                              variant='default'
                              className='mr-2 rounded-full px-3'
                              onClick={() => handleLoginRequired('purchase images')}
                            >
                              Buy now ${post.price}
                            </Button>
                          ))}
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className='pt-2'>
                      <PublicComments comments={comments} />
                    </div>
                  </div>
                </ScrollArea>

                {/* Footer Input - Login prompt */}
                <div className='border-border/40 bg-background/50 z-20 shrink-0 border-t p-4 backdrop-blur-md'>
                  <Button
                    variant='outline'
                    className='border-primary/20 hover:bg-primary/5 text-primary w-full rounded-full'
                    asChild
                  >
                    <Link href='/login'>Log in to join the conversation</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <FullScreenImageViewer
        isOpen={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        src={imageUrl}
        alt={displayPost.creator.name}
      />
    </>
  )
}
