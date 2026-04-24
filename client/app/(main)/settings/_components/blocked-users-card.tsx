'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import getImageUrl from '@/lib/get-images-url'
import getAllBlockedService from '@/services/contact/get-all-blocked'
import unfollowOrBlockOrUnblockService from '@/services/contact/unfollow-or-block-or-unblock'
import { Loader2, Unlock } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

interface BlockedUsersCardProps {
  token: string | null
}

const fetcher = async (token: string) => {
  const res = await getAllBlockedService(token)
  if (!res.isSuccess) throw new Error(res.errorMessage || 'Failed to fetch blocked users')
  return res.data
}

const BlockedUsersCard = ({ token }: BlockedUsersCardProps) => {
  const {
    data: blockedUsers,
    mutate,
    isLoading
  } = useSWR(token ? ['blocked-users', token] : null, ([, t]) => fetcher(t))
  const [unblockingId, setUnblockingId] = useState<string | null>(null)
  const router = useRouter()

  const handleUnblock = async (username: string) => {
    if (!token) return
    setUnblockingId(username)
    try {
      const res = await unfollowOrBlockOrUnblockService(username, 'UNBLOCK', token)
      if (res.isSuccess) {
        toast.success(`Unblocked @${username}`)
        // Update local data immediately
        mutate((currentData) => currentData?.filter((u) => u.username !== username), { revalidate: false })
        router.refresh()
      } else {
        toast.error(res.errorMessage || 'Failed to unblock user')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setUnblockingId(null)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blocked Users</CardTitle>
          <CardDescription>Manage users you have blocked</CardDescription>
        </CardHeader>
        <CardContent className='flex justify-center p-6'>
          <Loader2 className='text-muted-foreground h-6 w-6 animate-spin' />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blocked Users</CardTitle>
        <CardDescription>Manage users you have blocked</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        {!blockedUsers || blockedUsers.length === 0 ? (
          <div className='text-muted-foreground p-4 text-center text-sm'>You haven&apos;t blocked anyone yet.</div>
        ) : (
          blockedUsers.map((user) => (
            <div key={user.userId} className='flex items-center justify-between space-x-4 rounded-lg border p-3'>
              <div className='flex items-center space-x-4'>
                <div className='bg-muted relative h-10 w-10 overflow-hidden rounded-full border'>
                  {user.avatar ? (
                    <Image src={getImageUrl(user.avatar)} alt={user.name} fill className='object-cover' unoptimized />
                  ) : (
                    <div className='text-muted-foreground flex h-full w-full items-center justify-center font-bold'>
                      {user.name?.[0]}
                    </div>
                  )}
                </div>
                <div>
                  <p className='text-sm leading-none font-medium'>{user.name}</p>
                  <p className='text-muted-foreground text-sm'>@{user.username}</p>
                </div>
              </div>
              <Button
                variant='ghost'
                size='icon'
                disabled={unblockingId === user.username}
                onClick={() => handleUnblock(user.username)}
              >
                {unblockingId === user.username ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Unlock className='h-4 w-4' />
                )}
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export default BlockedUsersCard
