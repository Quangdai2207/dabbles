import { useConversationStore } from '@/lib/conversation-store'
import { useAuth } from '@/providers/AuthProvider'
import followOrAcceptOrDenyService from '@/services/contact/follow-or-accept-or-deny'
import unfollowOrBlockOrUnblockService from '@/services/contact/unfollow-or-block-or-unblock'
import createConversationsService from '@/services/conversations/create-conversation'

import findConversationService from '@/services/conversations/find-conversation'
import removeFollowerService from '@/services/contact/remove-follower'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useActionProfileLogic = (profile: TUserProfile) => {
  const { authData, token } = useAuth()
  const router = useRouter()
  const { setParticipantTemp } = useConversationStore()

  const isOwnProfile = authData?.id === profile.id
  const isFollowing = profile.followStatus === 'ACCEPTED'
  const isPending = profile.followStatus === 'PENDING'

  const handleSendMessage = async () => {
    if (!token) return
    setParticipantTemp(profile)
    const res = await findConversationService(profile.username, token)
    if (res.isSuccess && res.data) {
      router.push(`/messages?c=${res.data.conversationId}`)
      return
    }
    const resCreateConversation = await createConversationsService(token, [profile.username])
    const data = resCreateConversation.data
    if (resCreateConversation.isSuccess && data) {
      router.push(`/messages?c=${data.conversationId}`)
    }
  }

  const handleSendFollowRequest = async () => {
    if (!token) return router.push('/login')

    let res

    if (isFollowing || isPending) {
      res = await unfollowOrBlockOrUnblockService(profile.username, 'UNFOLLOW', token)
    } else {
      res = await followOrAcceptOrDenyService(profile.username, 'FOLLOW', token)
    }

    if (res.isSuccess) {
      toast.success(
        isFollowing
          ? `You have unfollowed ${profile.name}.`
          : isPending
            ? `Canceled follow request to ${profile.name}.`
            : `Follow request sent to ${profile.name}.`
      )
    } else {
      toast.error(res.errorMessage || 'Action failed.')
    }

    router.refresh()
  }

  const handleAcceptRequest = async () => {
    if (!token) return

    const res = await followOrAcceptOrDenyService(profile.username, 'ACCEPTED', token)

    if (res.isSuccess) {
      toast.success(`You have accepted ${profile.name}'s follow request.`)
      router.refresh()
    } else {
      toast.error(res.errorMessage || 'Action failed.')
    }
  }

  const handleDenyRequest = async () => {
    if (!token) return

    const res = await followOrAcceptOrDenyService(profile.username, 'DENY', token)

    if (res.isSuccess) {
      toast.success(`You have denied ${profile.name}'s follow request.`)
      router.refresh()
    } else {
      toast.error(res.errorMessage || 'Action failed.')
    }
  }

  const handleBlock = async () => {
    if (!token) return

    const res = await unfollowOrBlockOrUnblockService(profile.username, 'BLOCK', token)

    if (res.isSuccess) {
      toast.success(`You have blocked ${profile.name}.`)
      router.push('/')
      router.refresh()
    } else {
      toast.error(res.errorMessage || 'Action failed.')
    }
  }

  const handleRemoveFollower = async () => {
    if (!token) return

    const res = await removeFollowerService(token, profile.username)

    if (res.isSuccess) {
      toast.success(`You have removed ${profile.name} from your followers.`)
      router.refresh()
    } else {
      toast.error(res.errorMessage || 'Action failed.')
    }
  }

  return {
    isOwnProfile,
    isFollowing,
    isPending,
    handleSendMessage,
    handleSendFollowRequest,
    handleAcceptRequest,
    handleDenyRequest,
    handleBlock,
    handleRemoveFollower
  }
}
