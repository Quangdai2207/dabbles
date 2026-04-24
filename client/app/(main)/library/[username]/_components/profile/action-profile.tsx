'use client'

import { Button } from '@/components/ui/button'
import { Share2, Ellipsis, Ban, UserMinus } from 'lucide-react'
import { useActionProfileLogic } from './useActionProfileLogic'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const ActionProfile = ({ profile, isSenderPending }: { profile: TUserProfile; isSenderPending: boolean }) => {
  const {
    isOwnProfile,
    isFollowing,
    isPending,
    handleSendMessage,
    handleSendFollowRequest,
    handleAcceptRequest,
    handleDenyRequest,
    handleBlock,
    handleRemoveFollower
  } = useActionProfileLogic(profile)
  const router = useRouter()

  return (
    <div className='flex w-full max-w-sm items-center justify-center gap-3'>
      {isOwnProfile ? (
        <Button
          className='bg-foreground text-background hover:bg-foreground/90 flex-1 rounded-full font-medium transition-all'
          onClick={() => router.push(`/settings`)}
        >
          Edit profile
        </Button>
      ) : isSenderPending ? (
        <>
          <Button
            className='bg-primary hover:bg-primary/90 flex-1 rounded-full font-medium transition-all'
            onClick={handleAcceptRequest}
          >
            Accept
          </Button>
          <Button
            variant='outline'
            className='border-border/50 hover:bg-muted flex-1 rounded-full font-medium'
            onClick={handleDenyRequest}
          >
            Reject
          </Button>
        </>
      ) : (
        <>
          <Button
            className={cn(
              'flex-1 rounded-full font-medium transition-all',
              !isFollowing && !isPending
                ? 'bg-primary hover:bg-primary/90'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
            onClick={handleSendFollowRequest}
          >
            {isFollowing ? 'Following' : null}
            {isPending ? 'Requested' : null}
            {!isFollowing && !isPending ? 'Follow' : null}
          </Button>
          <Button
            variant='outline'
            className='border-border/50 hover:bg-muted flex-1 rounded-full font-medium'
            onClick={handleSendMessage}
          >
            Message
          </Button>
        </>
      )}

      <Button variant='outline' size='icon' className='border-border/50 hover:bg-muted shrink-0 rounded-full'>
        <Share2 className='h-4 w-4' />
      </Button>

      {!isOwnProfile ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='icon' className='border-border/50 hover:bg-muted shrink-0 rounded-full'>
              <Ellipsis className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {/* Show Remove Follower only if not pending request (and ideally if following, but lacking that info we assume check or user intent) */}
            {isFollowing ? (
              <DropdownMenuItem onClick={handleRemoveFollower} className='text-red-500 focus:text-red-500'>
                <UserMinus className='mr-2 h-4 w-4' />
                <span>Remove follower</span>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem onClick={handleBlock} className='text-red-500 focus:text-red-500'>
              <Ban className='mr-2 h-4 w-4' />
              <span>Block</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  )
}

export default ActionProfile
