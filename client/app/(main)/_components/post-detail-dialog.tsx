'use client'

import { useRouter } from 'next/navigation'
import { FullScreenImageViewer } from '@/components/full-screen-image-viewer'
import Comments from '@/app/(main)/_components/comments'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import getImageUrl from '@/lib/get-images-url'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import commentImageById from '@/services/image/comment-image-id'
import deleteImageService from '@/services/image/delete-image'
import getCommentImageById from '@/services/image/get-comment-image-id'
import getImagesByIdService from '@/services/image/get-images-by-id'
import likeImagesById from '@/services/image/like-image-id'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { Download, Heart, MessageCircle, MoreHorizontal, Smile, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
import downloadImage from '@/lib/download-image'
import { timeAgo } from '@/lib/time-convert'
import PostDialogSkeleton from './post-dialog/post-dialog-skeleton'

interface PostDetailDialogProps {
  post: TPostImage
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (() => void) | undefined
}

const fetcherDetailsImage = async ([id, token]: [string, string | null | undefined]) => {
  const res = await getImagesByIdService(id, token)
  if (!res.isSuccess) throw new Error('Failed to load image details')
  return res.data
}

const fetcherDataComments = async (imageId: string) => {
  const res = await getCommentImageById(imageId)
  if (!res.isSuccess) throw new Error('Failed to load image comments')
  return res.data
}

export function PostDetailDialog({ post, isOpen, onOpenChange, onDelete }: PostDetailDialogProps) {
  const { token, authData } = useAuth()
  const router = useRouter()
  const [comment, setComment] = useState('')
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    data: details,
    mutate: mutateDetails,
    isLoading: isDetailsLoading
  } = useSWR(isOpen ? [post.id, token] : null, fetcherDetailsImage, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  const {
    data: comments,
    mutate: mutateComments,
    isLoading: isCommentsLoading
  } = useSWR(isOpen ? post.id : null, fetcherDataComments, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  const isLoading = isDetailsLoading || isCommentsLoading

  const handleLikeImage = async () => {
    if (!token) return
    const res = await likeImagesById(post.id, token)
    if (res.isSuccess) {
      mutateDetails()
    } else {
      toast.error(res.errorMessage)
    }
  }

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setComment((prev) => prev + emojiData.emoji)
  }

  const handleSendComment = async () => {
    if (!comment.trim() || !authData) return
    const res = await commentImageById(post.id, comment.trim(), '', token!)
    if (res.isSuccess) {
      mutateDetails()
      mutateComments()
    } else {
      toast.error(res.errorMessage)
    }
    setComment('')
  }

  const handleDownload = async () => {
    await downloadImage(imageUrl)
  }

  const handleDeleteImage = async () => {
    if (!token) return
    setIsDeleting(true)
    const res = await deleteImageService(token, post.id)
    setIsDeleting(false)

    if (res.isSuccess) {
      toast.success('Image deleted successfully')
      setShowDeleteDialog(false)
      onOpenChange(false)
      onDelete?.()
      router.refresh()
    } else {
      toast.error(res.message || 'Failed to delete image')
    }
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
                    <Link href={`/library/${displayPost.creator.username}`} onClick={() => onOpenChange(false)}>
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
                          href={`/library/${displayPost.creator.username}`}
                          onClick={() => onOpenChange(false)}
                          className='text-sm font-bold hover:underline'
                        >
                          {displayPost.creator.name}
                        </Link>
                        <Link href={'/post/' + displayPost.id} className='text-muted-foreground text-xs'>
                          {timeAgo(displayPost.createdDate)}
                        </Link>
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
                      {details?.description ? (
                        <div className='text-foreground/90 text-[15px] leading-relaxed whitespace-pre-wrap'>
                          {details.description}
                        </div>
                      ) : null}

                      {details?.categories && details?.categories?.length > 0 ? (
                        <div className='flex flex-wrap gap-2 pt-1'>
                          {details.categories.map((cat) => (
                            <Link key={cat.name} href={`/search?category=${cat.slug}`}>
                              <Badge
                                variant='secondary'
                                className='hover:bg-secondary/80 cursor-pointer rounded-md px-2 py-0.5 text-xs font-medium transition-colors'
                              >
                                #{cat.name}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {/* Stats Row */}
                    <div className='border-border/40 flex w-full items-center justify-between gap-4 border-b py-2'>
                      <div className='flex items-center gap-4'>
                        <div className='group flex cursor-pointer items-center gap-1' onClick={handleLikeImage}>
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
                        {details?.purchased || displayPost.price === 0 || authData?.id === displayPost.creator.id ? (
                          <Button size='icon' className='mr-2 rounded-full' onClick={handleDownload}>
                            <Download className='h-5 w-5' />
                          </Button>
                        ) : (
                          <Button
                            variant='default'
                            className='mr-2 rounded-full px-3'
                            onClick={() => {
                              onOpenChange(false)
                              router.push(`/payment/${post.id}`)
                            }}
                          >
                            Buy now ${post.price}
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon' className='rounded-full'>
                              <MoreHorizontal className='h-5 w-5' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            {authData?.id === post.creator.id ? (
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/library/${authData.username}/edit-image/${post.id}`}
                                  className='cursor-pointer'
                                >
                                  <Edit className='mr-2 h-4 w-4' />
                                  Edit Image
                                </Link>
                              </DropdownMenuItem>
                            ) : null}
                            {authData?.id === post.creator.id ? (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.preventDefault()
                                  setShowDeleteDialog(true)
                                }}
                                className='cursor-pointer text-red-500 hover:text-red-600 focus:bg-red-50 focus:text-red-600'
                              >
                                <Trash2 className='mr-2 h-4 w-4' />
                                Delete Image
                              </DropdownMenuItem>
                            ) : null}
                            {/* Add more options here if needed later */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className='pt-2'>
                      <Comments
                        comments={comments}
                        token={token}
                        postId={displayPost.id}
                        mutateComments={mutateComments}
                      />
                    </div>
                  </div>
                </ScrollArea>

                {/* Footer Input */}
                <div className='border-border/40 bg-background/50 z-20 shrink-0 border-t p-4 backdrop-blur-md'>
                  {token ? (
                    <div className='bg-muted/30 focus-within:border-border/60 focus-within:bg-background flex items-end gap-2 rounded-2xl border border-transparent p-2 transition-all'>
                      <div className='relative mb-0.5 h-8 w-8 shrink-0 overflow-hidden rounded-full'>
                        {authData?.avatar ? (
                          <Image
                            src={getImageUrl(authData.avatar)}
                            alt={authData.firstName}
                            fill
                            className='object-cover'
                            unoptimized
                          />
                        ) : (
                          <div className='bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-xs font-medium'>
                            {authData?.firstName?.[0] || 'U'}
                          </div>
                        )}
                      </div>

                      <div className='relative flex-1'>
                        <Input
                          placeholder='Add a comment...'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className='h-auto min-h-[40px] border-0 bg-transparent px-2 py-2 focus-visible:ring-0 focus-visible:ring-offset-0'
                          onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                          autoComplete='off'
                        />
                      </div>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='text-muted-foreground hover:text-foreground mb-0.5 h-8 w-8 rounded-full'
                          >
                            <Smile className='h-5 w-5' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className='w-full border-none bg-transparent p-0 shadow-none'
                          side='top'
                          align='end'
                        >
                          <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </PopoverContent>
                      </Popover>

                      <Button
                        size='sm'
                        className={cn(
                          'mb-0.5 rounded-full transition-all duration-200',
                          comment.trim() ? 'scale-100 opacity-100' : 'w-0 scale-90 overflow-hidden p-0 opacity-0'
                        )}
                        disabled={!comment.trim()}
                        onClick={handleSendComment}
                      >
                        Post
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant='outline'
                      className='border-primary/20 hover:bg-primary/5 text-primary w-full rounded-full'
                      asChild
                    >
                      <Link href='/login'>Log in to join the conversation</Link>
                    </Button>
                  )}
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
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Deleted images cannot be recovered. However, users who have already purchased this image will still be
              able to download it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteImage()
              }}
              className='bg-red-500 hover:bg-red-600 focus:ring-red-600'
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
