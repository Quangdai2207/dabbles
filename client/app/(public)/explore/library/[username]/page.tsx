import PublicProfile from './_components/public-profile'
import PublicLibraryContent from './_components/public-library-content'
import NotFound from '@/app/not-found'
import getProfileService from '@/services/user/get-profile'

const PublicLibraryPage = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params
  const profile = await getProfileService(username, null)

  if (!profile.isSuccess || !profile.data) {
    return <NotFound />
  }

  return (
    <div className='container mx-auto mt-24 p-4'>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
        <div className='pr-8 lg:col-span-1'>
          <PublicProfile profile={profile.data} />
        </div>
        <div className='min-h-[calc(100vh-300px)] lg:col-span-3'>
          <PublicLibraryContent username={username} />
        </div>
      </div>
    </div>
  )
}

export default PublicLibraryPage
