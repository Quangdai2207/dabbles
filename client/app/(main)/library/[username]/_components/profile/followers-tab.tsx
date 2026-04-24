import { Button } from '@/components/ui/button'
import Image from 'next/image'
import getImageUrl from '@/lib/get-images-url'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TabsContent } from '@/components/ui/tabs'
import followOrAcceptOrDenyService from '@/services/contact/follow-or-accept-or-deny'
import unfollowOrBlockOrUnblockService from '@/services/contact/unfollow-or-block-or-unblock'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { KeyedMutator } from 'swr'
import { cn } from '@/lib/utils'
import removeFollowerService from '@/services/contact/remove-follower'
import { UserMinus } from 'lucide-react'

export const FollowersTab = ({
  users,
  token,
  authUserId,
  mutate,
  mutateFollowing
}: {
  users: TFollowerUser[]
  token: string | null
  authUserId?: string | null
  mutate: KeyedMutator<TResponseStatusObject<TFollowerUser[]>>
  mutateFollowing: KeyedMutator<TResponseStatusObject<TFollowingUser[]>>
}) => {
  const router = useRouter()

  const handleFollower = async (user: TFollowerUser) => {
    if (!token) return router.push('/login')

    const isFollowing = user.followStatus === 'ACCEPTED'
    const isPending = user.followStatus === 'PENDING'

    let res

    if (isFollowing || isPending) {
      res = await unfollowOrBlockOrUnblockService(user.username, 'UNFOLLOW', token)
    } else {
      res = await followOrAcceptOrDenyService(user.username, 'FOLLOW', token)
    }

    if (res.isSuccess) {
      toast.success(
        isFollowing
          ? `You have unfollowed ${user.name}.`
          : isPending
            ? `Canceled follow request to ${user.name}.`
            : `Follow request sent to ${user.name}.`
      )
      mutate()
      mutateFollowing()
    } else {
      toast.error(res.errorMessage || 'Action failed.')
    }
    router.refresh()
  }

  const handleRemoveFollower = async (username: string, name: string) => {
    if (!token) return

    const res = await removeFollowerService(token, username)

    if (res.isSuccess) {
      toast.success(`You have removed ${name} from your followers.`)
      mutate()
      mutateFollowing()
    } else {
      toast.error(res.errorMessage || 'Action failed.')
    }
  }

  return (
    <TabsContent value='followers' className='m-0 flex-1 overflow-hidden p-0'>
      <ScrollArea className='h-[60vh] p-4'>
        {users.map((user) => {
          const isFollowing = user.followStatus === 'ACCEPTED'
          const isPending = user.followStatus === 'PENDING'
          const isAuthUser = authUserId === user.userId
          return (
            <div
              key={user.userId}
              className='group hover:bg-muted/50 hover:border-border/40 mb-2 flex items-center justify-between space-x-4 rounded-xl border border-transparent p-3 transition-all last:mb-0'
            >
              <div className='flex min-w-0 items-center gap-3'>
                <div className='border-background relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 shadow-sm'>
                  {user.avatar ? (
                    <Image src={getImageUrl(user.avatar)} alt={user.name} fill className='object-cover' unoptimized />
                  ) : (
                    <div className='bg-primary/10 text-primary flex h-full w-full items-center justify-center font-medium'>
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <Link className='min-w-0 flex-1' href={`/library/${user.username}`}>
                  <p className='text-foreground truncate text-sm font-semibold'>{user.name}</p>
                  <p className='text-muted-foreground truncate text-xs'>@{user.username}</p>
                </Link>
              </div>

              {!isAuthUser && (
                <div className='flex items-center gap-2'>
                  <Button
                    size='sm'
                    variant={isFollowing ? 'secondary' : 'default'}
                    className={cn(
                      'h-9 rounded-full px-5 font-medium shadow-none transition-all',
                      isFollowing && 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    )}
                    onClick={() => handleFollower(user)}
                  >
                    {isFollowing ? 'Following' : null}
                    {isPending ? 'Requested' : null}
                    {!isFollowing && !isPending ? 'Follow' : null}
                  </Button>
                  <Button
                    size='icon'
                    variant='outline'
                    className='border-border/50 hover:bg-muted h-9 w-9 rounded-full text-red-500 shadow-none transition-all hover:text-red-500'
                    title='Remove follower'
                    onClick={() => handleRemoveFollower(user.username, user.name)}
                  >
                    <UserMinus className='h-4 w-4' />
                  </Button>
                </div>
              )}
            </div>
          )
        })}
        {users.length === 0 && (
          <div className='text-muted-foreground flex flex-col items-center justify-center py-16 text-center'>
            <p className='text-sm'>No followers yet.</p>
          </div>
        )}
      </ScrollArea>
    </TabsContent>
  )
}
