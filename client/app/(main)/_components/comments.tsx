'use client'

import { useState, useMemo, useCallback } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import commentImageById from '@/services/image/comment-image-id'
import CommentItem from './comment-item'
import { KeyedMutator } from 'swr'

const buildCommentTree = (comments: TCommentImage[]): CommentNode[] => {
  const map = new Map<string, CommentNode>()
  const roots: CommentNode[] = []

  comments.forEach((c) => {
    map.set(c.id, { ...c, replies: [] })
  })

  map.forEach((comment) => {
    if (comment.parentId && map.has(comment.parentId)) {
      map.get(comment.parentId)!.replies.push(comment)
    } else {
      roots.push(comment)
    }
  })

  return roots
}

type Props = {
  comments: TCommentImage[] | null | undefined
  token: string | null | undefined
  postId: string
  mutateComments: KeyedMutator<TCommentImage[] | null>
}

const Comments = ({ comments, token, postId, mutateComments }: Props) => {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
  const [reply, setReply] = useState('')

  const tree = useMemo(() => (comments ? buildCommentTree(comments) : []), [comments])

  const handleSendReply = useCallback(
    async (parentId: string) => {
      if (!reply.trim() || !token) return
      await commentImageById(postId, reply, parentId, token)
      mutateComments()
      setReply('')
      setActiveReplyId(null)
    },
    [reply, token, postId, mutateComments]
  )

  if (!comments || comments.length === 0) {
    return <p className='text-muted-foreground mt-4 text-center text-sm'>No comments yet. Be the first to comment!</p>
  }

  return (
    <div className='h-[calc(100vh-450px)]'>
      <ScrollArea className='h-full'>
        <div className='flex flex-col gap-4 py-4'>
          {tree.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              reply={reply}
              setReply={setReply}
              onSendReply={handleSendReply}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default Comments
