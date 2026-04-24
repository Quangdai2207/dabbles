import { ScrollArea } from '@/components/ui/scroll-area'
import CommentInput from './comment-input'
import CommentsList from './comments-list'
import PostDescription from './post-description'
import PostHeader from './post-header'
import PostInteractionBar from './post-interaction-bar'

interface PostDetailsRightPanelProps {
  post: TPostImageDetails
  comments: TCommentImage[]
}

export default function PostDetailsRightPanel({ post, comments }: PostDetailsRightPanelProps) {
  return (
    <div className='border-border/10 flex h-[55vh] flex-col border-l backdrop-blur-xl lg:col-span-2 lg:h-full'>
      <PostHeader post={post} />
      <ScrollArea className='w-full flex-1'>
        <div className='flex flex-col gap-4 p-5'>
          <PostDescription description={post.description} categories={post.categories} />
          <PostInteractionBar post={post} />
          <div className='pt-2'>
            <CommentsList comments={comments} postId={post.id} />
          </div>
        </div>
      </ScrollArea>
      <CommentInput postId={post.id} />
    </div>
  )
}
