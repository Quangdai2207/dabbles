'use client'

import ActionProfile from '@/app/(main)/library/[username]/_components/profile/action-profile'
import dynamic from 'next/dynamic'
const SocialDialog = dynamic(() => import('@/app/(main)/library/[username]/_components/profile/social-dialog'), {
  ssr: false
})
import formatLike from '@/lib/format-like'
import getImageUrl from '@/lib/get-images-url'
import { useAuth } from '@/providers/AuthProvider'
import Image from 'next/image'
import { FullScreenImageViewer } from '@/components/full-screen-image-viewer'
import { BadgeCheck } from 'lucide-react'
import { useMemo, useState } from 'react'

const Profile = ({ profile, isSenderPending }: { profile: TUserProfile; isSenderPending: boolean }) => {
  const { authData } = useAuth()
  const isAuthUser = authData?.id === profile.id
  const [isSocialDialogOpen, setIsSocialDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'following' | 'followers' | 'pending'>('following')
  const [isFullScreen, setIsFullScreen] = useState(false)
  const totalLikeFormatted = useMemo(() => formatLike(profile.totalLike), [profile.totalLike])
  return (
    <div className='sticky top-12 flex flex-col items-center gap-6'>
      <div className='group relative'>
        <div className='absolute -inset-2 animate-[spin_3s_linear_infinite] rounded-full bg-linear-to-r from-pink-600 to-purple-600 opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200'></div>
        <div
          className='border-background relative h-60 w-60 shrink-0 cursor-zoom-in overflow-hidden rounded-full border-4 shadow-xl'
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
        <div className='flex items-center justify-center gap-2'>
          <h2 className='text-2xl font-bold tracking-tight'>{profile.name}</h2>
          {profile.expiredDay && new Date(profile.expiredDay) > new Date() && (
            <BadgeCheck className='h-6 w-6 fill-blue-500 text-white' />
          )}
        </div>
        <p className='text-muted-foreground font-medium'>@{profile.username}</p>
      </div>

      <ActionProfile profile={profile} isSenderPending={isSenderPending} />

      <div className='border-border/50 grid w-full grid-cols-3 gap-2 border-y py-4 text-center'>
        <div
          className='hover:bg-muted/50 cursor-pointer rounded-lg py-2 transition-colors'
          onClick={() => {
            setIsSocialDialogOpen(true)
            setActiveTab('following')
          }}
        >
          <p className='text-lg font-bold'>{profile.following}</p>
          <p className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>Following</p>
        </div>
        <div
          className='hover:bg-muted/50 cursor-pointer rounded-lg py-2 transition-colors'
          onClick={() => {
            setIsSocialDialogOpen(true)
            setActiveTab('followers')
          }}
        >
          <p className='text-lg font-bold'>{profile.follower}</p>
          <p className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>Followers</p>
        </div>
        <div className='py-2'>
          <p className='text-lg font-bold'>{totalLikeFormatted}</p>
          {/* Hardcoded Likes for now as per original code */}
          <p className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>Likes</p>
        </div>
      </div>

      <SocialDialog
        open={isSocialDialogOpen}
        onOpenChange={setIsSocialDialogOpen}
        isAuthUser={isAuthUser}
        username={profile.username}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

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

export default Profile
