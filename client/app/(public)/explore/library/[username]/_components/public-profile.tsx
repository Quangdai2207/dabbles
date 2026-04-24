'use client'

import { FullScreenImageViewer } from '@/components/full-screen-image-viewer'
import { Button } from '@/components/ui/button'
import formatLike from '@/lib/format-like'
import getImageUrl from '@/lib/get-images-url'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

const PublicProfile = ({ profile }: { profile: TUserProfile }) => {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const totalLikeFormatted = useMemo(() => formatLike(profile.totalLike), [profile.totalLike])

  const handleLoginRequired = (action: string) => {
    toast.info(`Please log in to ${action}`, {
      action: {
        label: 'Log in',
        onClick: () => (window.location.href = '/login')
      }
    })
  }

  return (
    <div className='sticky top-28 flex flex-col items-center gap-6'>
      <div className='group relative'>
        <div className='absolute -inset-0.5 rounded-full bg-linear-to-r from-pink-600 to-purple-600 opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200'></div>
        <div
          className='border-background relative h-32 w-32 shrink-0 cursor-zoom-in overflow-hidden rounded-full border-4 shadow-xl'
          onClick={() => setIsFullScreen(true)}
        >
          {profile.avatar ? (
            <Image src={getImageUrl(profile.avatar)} alt={profile.username} fill className='object-cover' unoptimized />
          ) : (
            <div className='bg-muted flex h-full w-full items-center justify-center text-4xl font-bold'>
              {profile.name[0]}
            </div>
          )}
        </div>
      </div>

      <div className='space-y-1 text-center'>
        <h2 className='text-2xl font-bold tracking-tight'>{profile.name}</h2>
        <p className='text-muted-foreground font-medium'>@{profile.username}</p>
      </div>

      {/* Action Buttons - Login prompts */}
      <div className='flex gap-2'>
        <Button onClick={() => handleLoginRequired('follow users')}>Follow</Button>
        <Button variant='outline' onClick={() => handleLoginRequired('send messages')}>
          Message
        </Button>
      </div>

      <div className='border-border/50 grid w-full grid-cols-3 gap-2 border-y py-4 text-center'>
        <div className='py-2'>
          <p className='text-lg font-bold'>{profile.following}</p>
          <p className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>Following</p>
        </div>
        <div className='py-2'>
          <p className='text-lg font-bold'>{profile.follower}</p>
          <p className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>Followers</p>
        </div>
        <div className='py-2'>
          <p className='text-lg font-bold'>{totalLikeFormatted}</p>
          <p className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>Likes</p>
        </div>
      </div>

      <div className='w-full px-4 text-center'>
        <p className='text-muted-foreground text-sm leading-relaxed'>
          {profile.bio || <span className='italic opacity-50'>No bio available</span>}
        </p>
      </div>

      <FullScreenImageViewer
        isOpen={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        src={getImageUrl(profile.avatar || '')}
        alt={profile.username}
      />
    </div>
  )
}

export default PublicProfile
