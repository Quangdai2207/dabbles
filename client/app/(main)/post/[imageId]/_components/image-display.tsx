'use client'

import getImageUrl from '@/lib/get-images-url'
import Image from 'next/image'
import { useState } from 'react'
import { FullScreenImageViewer } from '@/components/full-screen-image-viewer'

interface ImageDisplayProps {
  post: TPostImageDetails
}

export default function ImageDisplay({ post }: ImageDisplayProps) {
  const imageUrl = getImageUrl(post.imageUrls.w1080)
  const [isFullScreen, setIsFullScreen] = useState(false)

  return (
    <>
      <div className='relative flex min-h-[50vh] w-full items-center justify-center overflow-hidden rounded-xl border'>
        {/* Background Blur */}
        <div className='absolute inset-0 z-0'>
          <Image
            src={imageUrl}
            alt=''
            fill
            className='scale-150 object-cover opacity-20 blur-[80px]'
            priority
            unoptimized
          />
        </div>

        {/* Main Image */}
        <div
          className='relative z-10 cursor-zoom-in p-4 transition-transform hover:scale-[1.01] active:scale-[0.99] lg:p-8'
          onClick={() => setIsFullScreen(true)}
          onContextMenu={(e) => e.preventDefault()}
        >
          <Image
            src={imageUrl}
            alt={post.creator.name}
            width={1400}
            height={1400}
            className='max-h-[85vh] w-auto max-w-full rounded-lg object-contain shadow-2xl'
            priority
            unoptimized
          />
        </div>
      </div>

      <FullScreenImageViewer
        isOpen={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        src={imageUrl}
        alt={post.creator.name}
      />
    </>
  )
}
