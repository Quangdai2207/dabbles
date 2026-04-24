import GetAuthToken from '@/lib/get-auth-token'
import getImagesByIdService from '@/services/image/get-images-by-id'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ImageDisplay from './_components/image-display'
import PostHeader from './_components/post-header'
import PostInteractionBar from './_components/post-interaction-bar'
import PostDescription from './_components/post-description'
import CommentsList from './_components/comments-list'
import CommentInput from './_components/comment-input'
import BackButton from '../../_components/back-button'
import getCommentImageById from '@/services/image/get-comment-image-id'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ imageId: string }> }): Promise<Metadata> {
  const { imageId } = await params
  const res = await getImagesByIdService(imageId, null)
  if (!res.isSuccess || !res.data) return { title: 'Post Not Found' }

  const post = res.data
  return {
    title: `Post by ${post.creator.name}`,
    description: post.description || `Check out this creative work by ${post.creator.name} on Dabble.`,
    openGraph: {
      title: `Post by ${post.creator.name} | Dabble`,
      description: post.description || `Check out this creative work by ${post.creator.name} on Dabble.`,
      images: [post.imageUrls.w1080]
    }
  }
}

const PostDetailPage = async ({ params }: { params: Promise<{ imageId: string }> }) => {
  const { imageId } = await params
  const token = await GetAuthToken()

  const [postDetailsRes, commentsRes] = await Promise.all([
    getImagesByIdService(imageId, token),
    getCommentImageById(imageId)
  ])

  if (!postDetailsRes.isSuccess || !postDetailsRes.data) {
    return (
      <div className='flex h-[50vh] flex-col items-center justify-center gap-4 text-center'>
        <h2 className='text-2xl font-bold'>Post not found</h2>
        <p className='text-muted-foreground'>The image you are looking for does not exist or has been removed.</p>
        <Button variant='default' asChild>
          <Link href='/'>Go Home</Link>
        </Button>
      </div>
    )
  }

  const post = postDetailsRes.data
  const comments = commentsRes.data || []

  return (
    <div className='bg-background/50 min-h-screen'>
      <div className='container mx-auto max-w-7xl'>
        {/* Back Button */}
        <div className='mb-6 flex items-center'>
          <BackButton />
        </div>

        <div className='grid gap-12 lg:grid-cols-12'>
          {/* Left Column: Image Display */}
          <div className='order-2 flex flex-col gap-6 lg:order-1 lg:col-span-7'>
            <ImageDisplay post={post} />
          </div>

          {/* Right Column: Post Details */}
          <div className='order-1 flex flex-col gap-8 lg:order-2 lg:col-span-5'>
            <div className='bg-card/50 space-y-6 rounded-3xl border p-6 shadow-sm backdrop-blur-sm md:p-8'>
              <PostHeader post={post} />
              <PostDescription description={post.description} categories={post.categories} />
              <PostInteractionBar post={post} />
            </div>

            {/* Comments Section */}
            <div className='bg-card/50 space-y-6 rounded-3xl border p-6 shadow-sm backdrop-blur-sm md:p-8'>
              <h3 className='text-xl font-semibold'>Comments ({post.commentCount})</h3>
              <CommentInput postId={post.id} />
              <CommentsList comments={comments} postId={post.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetailPage
