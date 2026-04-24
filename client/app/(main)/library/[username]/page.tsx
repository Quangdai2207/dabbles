import LikedContent from '@/app/(main)/library/[username]/_components/library/liked-content'
import PurchasedContent from '@/app/(main)/library/[username]/_components/library/purchased-contnent'
import YourLibraryContent from '@/app/(main)/library/[username]/_components/library/your-library-content'
import Library from '@/app/(main)/library/[username]/_components/library/library'
import Profile from '@/app/(main)/library/[username]/_components/profile/profile'
import NotFound from '@/app/not-found'
import { Metadata } from 'next'
import getProfileService from '@/services/user/get-profile'

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params
  const res = await getProfileService(username, null)
  if (!res.isSuccess || !res.data) return { title: 'User Not Found' }

  const user = res.data
  return {
    title: `${user.name} (@${user.username})`,
    description: `View ${user.name}'s library and creative work on Dabble.`,
    openGraph: {
      title: `${user.name} (@${user.username}) | Dabble`,
      description: `View ${user.name}'s library and creative work on Dabble.`,
      images: [user.avatar ? user.avatar : '/default-avatar.png']
    }
  }
}

import GetAuthToken from '@/lib/get-auth-token'
import getListPendingService from '@/services/contact/get-list-pending'

const LibraryPage = async ({ params }: { params: Promise<{ username: string }> }) => {
  const [resolvedParams, token] = await Promise.all([params, GetAuthToken()])
  const { username } = resolvedParams

  const [profile, listPendingStatus] = await Promise.all([
    getProfileService(username, token),
    token ? getListPendingService(token) : Promise.resolve({ isSuccess: false, data: null })
  ])

  let isSenderPending = false
  if (listPendingStatus.isSuccess && listPendingStatus.data) {
    isSenderPending = listPendingStatus.data.some((u) => u.username === username)
  }

  if (!profile.isSuccess || !profile.data) {
    return <NotFound />
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
        <div className='pr-8 lg:col-span-1'>
          <Profile profile={profile.data} isSenderPending={isSenderPending} />
        </div>
        <div className='min-h-[calc(100vh-300px)] lg:col-span-3'>
          <Library
            username={username}
            postsContent={<YourLibraryContent username={username} token={token} />}
            likedContent={<LikedContent token={token} />}
            purchasedContent={<PurchasedContent token={token} />}
          />
        </div>
      </div>
    </div>
  )
}

export default LibraryPage
