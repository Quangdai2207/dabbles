import { Button } from '@/components/ui/button'
import Image from 'next/image'
import getImageUrl from '@/lib/get-images-url'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TabsContent } from '@/components/ui/tabs'
import followOrAcceptOrDenyService from '@/services/contact/follow-or-accept-or-deny'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const PendingTab = ({
  users,
  token,
  onUserRemoved
}: {
  users: TPendingUser[]
  token: string | null
  onUserRemoved: (userId: string) => void
}) => {
  const router = useRouter()

  const handleFollower = async (user: TFollowerUser, type: 'ACCEPTED' | 'DENY') => {
    if (!token) return router.push('/login')
    const res = await followOrAcceptOrDenyService(user.username, type, token)
    if (res.isSuccess) {
      toast.success(`You have ${type === 'ACCEPTED' ? 'accepted' : 'denied'} the follow request from ${user.name}.`)
      onUserRemoved(user.userId)
    } else {
      toast.error(res.errorMessage || 'Action failed.')
    }
    router.refresh()
  }
  return (
    <TabsContent value='pending' className='m-0 flex-1 overflow-hidden p-0'>
      <ScrollArea className='h-[60vh] p-4'>
        {users.map((user) => (
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

            <div className='ml-auto flex items-center space-x-2'>
              <Button
                size='sm'
                variant='default'
                className='h-8 rounded-full px-4'
                onClick={() => handleFollower(user, 'ACCEPTED')}
              >
                Approve
              </Button>
              <Button
                size='icon'
                variant='ghost'
                className='hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-full'
                onClick={() => handleFollower(user, 'DENY')}
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className='text-muted-foreground flex flex-col items-center justify-center py-16 text-center'>
            <p className='text-sm'>No pending requests.</p>
          </div>
        )}
      </ScrollArea>
    </TabsContent>
  )
}
