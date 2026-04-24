'use client'

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
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import downloadImage from '@/lib/download-image'
import getImageUrl from '@/lib/get-images-url'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import deleteImageService from '@/services/image/delete-image'
import likeImagesById from '@/services/image/like-image-id'
import { Download, Edit, Heart, MessageCircle, MoreHorizontal, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface PostInteractionBarProps {
  post: TPostImageDetails
}

export default function PostInteractionBar({ post }: PostInteractionBarProps) {
  const { token, authData } = useAuth()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(post.liked)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleLikeImage = async () => {
    if (!token) {
      toast.error('Please login to like')
      return
    }

    const newLikedState = !isLiked
    setIsLiked(newLikedState)
    setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1))

    const res = await likeImagesById(post.id, token)
    if (!res.isSuccess) {
      setIsLiked(!newLikedState)
      setLikeCount((prev) => (!newLikedState ? prev + 1 : prev - 1))
      toast.error(res.errorMessage)
    } else {
      router.refresh()
    }
  }

  const handleDownload = async () => {
    await downloadImage(getImageUrl(post.imageUrls.original))
  }

  const handleDeleteImage = async () => {
    if (!token) return
    setIsDeleting(true)
    const res = await deleteImageService(token, post.id)
    setIsDeleting(false)

    if (res.isSuccess) {
      toast.success('Image deleted successfully')
      setShowDeleteDialog(false)
      router.push('/')
      router.refresh()
    } else {
      toast.error(res.message || 'Failed to delete image')
    }
  }

  return (
    <>
      <div className='border-border/40 flex w-full items-center justify-between gap-4 border-b py-2'>
        <div className='flex items-center gap-4'>
          <div className='group flex cursor-pointer items-center gap-1' onClick={handleLikeImage}>
            <Heart
              className={cn(
                'h-6 w-6 transition-all duration-300 group-active:scale-90',
                isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground group-hover:text-red-500'
              )}
            />
            <span className='text-sm font-medium'>{likeCount} likes</span>
          </div>
          <div className='text-muted-foreground flex items-center gap-1'>
            <MessageCircle className='h-6 w-6' />
            <span className='text-sm font-medium'>{post.commentCount} comments</span>
          </div>
        </div>
        <div className='flex gap-1'>
          {post.purchased || post.price === 0 || authData?.id === post.creator.id ? (
            <Button size='icon' className='mr-2 rounded-full' onClick={handleDownload}>
              <Download className='h-5 w-5' />
            </Button>
          ) : (
            <Button
              variant='default'
              className='mr-2 rounded-full px-3'
              onClick={() => router.push(`/payment/${post.id}`)}
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
              {authData?.id === post.creator.id && (
                <DropdownMenuItem asChild>
                  <Link href={`/library/${authData.username}/edit-image/${post.id}`} className='cursor-pointer'>
                    <Edit className='mr-2 h-4 w-4' />
                    Edit Image
                  </Link>
                </DropdownMenuItem>
              )}
              {authData?.id === post.creator.id && (
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
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
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
