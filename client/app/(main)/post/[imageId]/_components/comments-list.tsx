'use client'

import CommentItem from '@/app/(main)/_components/comment-item'
import { useAuth } from '@/providers/AuthProvider'
import commentImageById from '@/services/image/comment-image-id'
import { useRouter } from 'next/navigation'
import { memo, useMemo, useState } from 'react'

interface CommentsListProps {
  comments: TCommentImage[]
  postId: string
}

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

const CommentsList = ({ comments, postId }: CommentsListProps) => {
  const { token } = useAuth()
  const router = useRouter()
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
  const [reply, setReply] = useState('')

  const tree = useMemo(() => (comments ? buildCommentTree(comments) : []), [comments])

  const handleSendReply = async (parentId: string) => {
    if (!reply.trim() || !token) return
    await commentImageById(postId, reply, parentId, token)
    setReply('')
    setActiveReplyId(null)
    router.refresh()
  }

  if (!comments || comments.length === 0) {
    return <p className='text-muted-foreground mt-4 text-center text-sm'>No comments yet. Be the first to comment!</p>
  }

  return (
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
  )
}

export default memo(CommentsList)
