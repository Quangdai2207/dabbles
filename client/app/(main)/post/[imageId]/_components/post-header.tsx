import getImageUrl from '@/lib/get-images-url'
import { timeAgo } from '@/lib/time-convert'
import Image from 'next/image'
import Link from 'next/link'

interface PostHeaderProps {
  post: TPostImageDetails
}

export default function PostHeader({ post }: PostHeaderProps) {
  const { creator, createdDate } = post
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-4'>
        <Link href={`/library/${creator.username}`} className='shrink-0'>
          <div className='ring-primary/10 relative h-12 w-12 overflow-hidden rounded-full ring-2'>
            {creator.avatar ? (
              <Image src={getImageUrl(creator.avatar)} alt={creator.name} fill className='object-cover' unoptimized />
            ) : (
              <div className='bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-lg'>
                {creator.name[0]}
              </div>
            )}
          </div>
        </Link>
        <div className='flex flex-col gap-0.5'>
          <Link href={`/library/${creator.username}`} className='text-base font-bold hover:underline'>
            {creator.name}
          </Link>
          <div className='text-muted-foreground flex items-center gap-2 text-sm'>
            <span>@{creator.username}</span>
            <span>•</span>
            <span>{timeAgo(createdDate)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
