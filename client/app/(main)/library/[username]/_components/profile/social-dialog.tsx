'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/providers/AuthProvider'
import getListFollowerService from '@/services/contact/get-list-follower'
import getListFollowingService from '@/services/contact/get-list-following'
import getListPendingService from '@/services/contact/get-list-pending'
import useSWR from 'swr'
import { FollowersTab } from './followers-tab'
import { FollowingTab } from './following-tab'
import { PendingTab } from './pending-tab'

interface SocialDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isAuthUser: boolean
  username: string
  activeTab: 'following' | 'followers' | 'pending'
  setActiveTab: (tab: 'following' | 'followers' | 'pending') => void
}

const SocialDialog = ({ open, onOpenChange, isAuthUser, username, activeTab, setActiveTab }: SocialDialogProps) => {
  const { token, authData } = useAuth()

  const shouldFetch = open && !!token

  const { data: followingRes, mutate: mutateFollowing } = useSWR(
    shouldFetch ? ['following', username] : null,
    () => getListFollowingService(username, token!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  const { data: followerRes, mutate: mutateFollower } = useSWR(
    shouldFetch ? ['followers', username] : null,
    () => getListFollowerService(username, token!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  const { data: pendingRes, mutate: mutatePending } = useSWR(
    shouldFetch && isAuthUser ? ['pending'] : null,
    () => getListPendingService(token!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  const followingUsers = followingRes?.data || []
  const followerUsers = followerRes?.data || []
  const pendingUsers = pendingRes?.data || []

  const handlePendingUserRemoved = (removedUserId: string) => {
    mutatePending(
      (currentData) => {
        if (!currentData || !currentData.data) return currentData
        return {
          ...currentData,
          data: currentData.data.filter((u) => u.userId !== removedUserId)
        }
      },
      { revalidate: false }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[85vh] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-xl'>
        <DialogHeader className='border-border/40 border-b p-6 pb-2'>
          <DialogTitle className='text-center text-xl font-bold'>Connections</DialogTitle>
          <DialogDescription className='sr-only'>
            List of followers, following, and pending requests for {username}.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          className='flex flex-1 flex-col overflow-hidden'
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'following' | 'followers' | 'pending')}
        >
          <TabsList className='border-border/40 bg-background h-auto w-full justify-start rounded-none border-b p-0'>
            <TabsTrigger
              value='following'
              onClick={() => setActiveTab('following')}
              className='data-[state=active]:border-primary text-muted-foreground data-[state=active]:text-foreground flex-1 rounded-none py-4 font-medium transition-all data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none'
            >
              Following{' '}
              <span className='bg-muted text-muted-foreground ml-1.5 rounded-full px-1.5 py-0.5 text-xs'>
                {followingUsers.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value='followers'
              onClick={() => setActiveTab('followers')}
              className='data-[state=active]:border-primary text-muted-foreground data-[state=active]:text-foreground flex-1 rounded-none py-4 font-medium transition-all data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none'
            >
              Followers{' '}
              <span className='bg-muted text-muted-foreground ml-1.5 rounded-full px-1.5 py-0.5 text-xs'>
                {followerUsers.length}
              </span>
            </TabsTrigger>
            {isAuthUser ? (
              <TabsTrigger
                value='pending'
                onClick={() => setActiveTab('pending')}
                className='data-[state=active]:border-primary text-muted-foreground data-[state=active]:text-foreground flex-1 rounded-none py-4 font-medium transition-all data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none'
              >
                Pending{' '}
                <span className='bg-muted text-muted-foreground ml-1.5 rounded-full px-1.5 py-0.5 text-xs'>
                  {pendingUsers.length}
                </span>
              </TabsTrigger>
            ) : null}
          </TabsList>

          <FollowingTab
            users={followingUsers}
            token={token}
            authUserId={authData?.id ?? null}
            mutate={mutateFollowing}
            mutateFollower={mutateFollower}
          />
          <FollowersTab
            users={followerUsers}
            token={token}
            authUserId={authData?.id ?? null}
            mutate={mutateFollower}
            mutateFollowing={mutateFollowing}
          />
          {isAuthUser ? (
            <PendingTab users={pendingUsers} token={token} onUserRemoved={handlePendingUserRemoved} />
          ) : null}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default SocialDialog
