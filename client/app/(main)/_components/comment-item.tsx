'use client'

import { memo, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Smile, Send } from 'lucide-react'
import getImageUrl from '@/lib/get-images-url'
import { timeAgo } from '@/lib/time-convert'

type CommentItemProps = {
  comment: CommentNode
  level?: number
  activeReplyId: string | null
  setActiveReplyId: (id: string | null) => void
  reply: string
  setReply: (v: string) => void
  onSendReply: (parentId: string) => void
}

const CommentItem = ({
  comment,
  level = 0,
  activeReplyId,
  setActiveReplyId,
  reply,
  setReply,
  onSendReply
}: CommentItemProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  // ✅ rootId luôn là comment gốc của thread
  const rootId = comment.parentId || comment.id

  // ✅ xác định đang reply trong thread này hay không
  const isReplyingInThisThread = activeReplyId === comment.id || activeReplyId === rootId

  // ✅ Auto focus input
  useEffect(() => {
    if (activeReplyId === comment.id) {
      inputRef.current?.focus()
    }
  }, [activeReplyId, comment.id])

  return (
    <div
      className={`flex gap-3 rounded-lg p-2 transition-colors ${
        isReplyingInThisThread && level === 0 ? 'bg-muted/40' : ''
      }`}
      style={{ marginLeft: level * 24 }}
    >
      {/* Avatar */}
      <div className='relative h-8 w-8 shrink-0 overflow-hidden rounded-full'>
        {comment.sender.avatar ? (
          <Image
            src={getImageUrl(comment.sender.avatar)}
            alt={comment.sender.name}
            fill
            className='object-cover'
            unoptimized
          />
        ) : (
          <div className='bg-primary/10 text-primary flex h-full w-full items-center justify-center text-sm font-medium'>
            {comment.sender.name[0]}
          </div>
        )}
      </div>

      <div className='flex-1'>
        {/* Header */}
        <div className='flex items-center gap-2 text-sm'>
          <span className='font-medium'>{comment.sender.name}</span>
          <span className='text-muted-foreground text-xs'>{timeAgo(comment.createdDate)}</span>

          {/* Badge nhỏ báo đang reply thread này */}
          {isReplyingInThisThread && level === 0 ? (
            <span className='ml-2 rounded bg-blue-100 px-2 py-0.5 text-[10px] text-blue-600'>Replying</span>
          ) : null}
        </div>

        {/* Content */}
        <p className='mt-1 text-sm leading-relaxed'>{comment.content}</p>

        {/* Action */}
        <button
          className='text-muted-foreground mt-1 cursor-pointer text-xs hover:underline'
          onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
        >
          Reply
        </button>

        {/* Reply input */}
        {activeReplyId === comment.id ? (
          <div className='mt-2 flex items-center gap-2'>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='ghost' size='icon' className='h-8 w-8'>
                  <Smile className='h-5 w-5' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='border-none bg-transparent p-0 shadow-none'>
                {/* EmojiPicker */}
              </PopoverContent>
            </Popover>

            <div className='relative flex-1'>
              <Input
                ref={inputRef}
                placeholder={`Reply to ${comment.sender.name}`}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className='rounded-full pr-10'
                onKeyDown={(e) => e.key === 'Enter' && onSendReply(rootId)}
              />
              <Button
                size='icon'
                variant='ghost'
                className='absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 text-blue-500'
                disabled={!reply.trim()}
                onClick={() => onSendReply(rootId)}
              >
                <Send className='h-4 w-4' />
              </Button>
            </div>
          </div>
        ) : null}

        {/* Replies (render UI tree nhưng logic 1 cấp) */}
        {comment.replies.length > 0 ? (
          <div className='mt-3 flex flex-col gap-3'>
            {comment.replies.map((child) => (
              <CommentItem
                key={child.id}
                comment={child}
                level={level + 1}
                activeReplyId={activeReplyId}
                setActiveReplyId={setActiveReplyId}
                reply={reply}
                setReply={setReply}
                onSendReply={onSendReply}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default memo(CommentItem)
