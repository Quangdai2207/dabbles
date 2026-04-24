'use client'

import getImageUrl from '@/lib/get-images-url'
import { timeAgo } from '@/lib/time-convert'
import Image from 'next/image'
import Link from 'next/link'

interface PublicCommentsProps {
  comments: TCommentImage[] | null | undefined
}

const PublicComments = ({ comments }: PublicCommentsProps) => {
  if (!comments || comments.length === 0) {
    return (
      <div className='text-muted-foreground py-8 text-center text-sm'>No comments yet. Be the first to comment!</div>
    )
  }

  return (
    <div className='space-y-4'>
      {comments.map((comment) => (
        <div key={comment.id} className='flex gap-3'>
          <Link href={`/explore/library/${comment.sender.username}`}>
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
                <div className='bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-xs font-medium'>
                  {comment.sender.name[0]}
                </div>
              )}
            </div>
          </Link>
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <Link
                href={`/explore/library/${comment.sender.username}`}
                className='text-sm font-semibold hover:underline'
              >
                {comment.sender.name}
              </Link>
              <span className='text-muted-foreground text-xs'>{timeAgo(comment.createdDate)}</span>
            </div>
            <p className='text-foreground/90 mt-1 text-sm'>{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PublicComments
