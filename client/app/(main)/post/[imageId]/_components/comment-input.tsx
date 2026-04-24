'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import getImageUrl from '@/lib/get-images-url'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import commentImageById from '@/services/image/comment-image-id'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { Smile } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface CommentInputProps {
  postId: string
}

export default function CommentInput({ postId }: CommentInputProps) {
  const { token, authData } = useAuth()
  const router = useRouter()
  const [comment, setComment] = useState('')

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setComment((prev) => prev + emojiData.emoji)
  }

  const handleSendComment = async () => {
    if (!comment.trim() || !authData) return
    const res = await commentImageById(postId, comment.trim(), '', token!)
    if (res.isSuccess) {
      setComment('')
      router.refresh()
    } else {
      toast.error(res.errorMessage)
    }
  }

  return (
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
            <PopoverContent className='w-full border-none bg-transparent p-0 shadow-none' side='top' align='end'>
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
  )
}
