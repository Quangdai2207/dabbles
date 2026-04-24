'use client'
import { loginGoogleService } from '@/services/auth/login-google-service'
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const GoogleLoginComponent = () => {
  const router = useRouter()
  const onSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const res = await loginGoogleService(credentialResponse.credential)
      if (res.isSuccess) {
        router.push('/')
        router.refresh()
        toast.success('Login successfully')
        return
      }

      if (!res.isSuccess) {
        toast.error(res.errorMessage || 'Failed to login. Please try again.')
      }
    }

    toast.error('Failed to login. Please try again.')
  }

  const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  if (!CLIENT_ID) {
    return <></>
  }

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <GoogleLogin onSuccess={onSuccess} />
    </GoogleOAuthProvider>
  )
}

export default GoogleLoginComponent
