import ViewLoggedIn from '@/app/(main)/_components/view-logged-in'
import ViewNotLoggedIn from '@/app/(main)/_components/view-not-logged-in'
import GetAuthToken from '@/lib/get-auth-token'
import AuthProvider from '@/providers/AuthProvider'
import StompProvider from '@/providers/StompProvider'
import NotificationSocket from '@/app/(main)/socketConnect'

const layout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const token = await GetAuthToken()

  if (!token) return <ViewNotLoggedIn />

  return (
    <AuthProvider token={token}>
      <StompProvider>
        <NotificationSocket token={token?.toString() ?? ''} />
        <ViewLoggedIn>{children}</ViewLoggedIn>
      </StompProvider>
    </AuthProvider>
  )
}

export default layout
