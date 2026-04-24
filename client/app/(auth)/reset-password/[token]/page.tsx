import ResetPasswordForm from '@/app/(auth)/reset-password/[token]/_components/reset-password-form'
import { Button } from '@/components/ui/button'
import checkValidTokenService from '@/services/auth/check-valid-token'
import { AlertTriangle, KeyRound } from 'lucide-react'
import Link from 'next/link'

const ResetPassword = async ({ params }: { params: Promise<{ token: string }> }) => {
  const { token } = await params
  const resCheckValidToken = await checkValidTokenService(token)

  if (!resCheckValidToken.isSuccess) {
    return (
      <div className='flex flex-col items-center justify-center space-y-6 text-center'>
        <div className='flex justify-center'>
          <AlertTriangle className='text-destructive h-12 w-12' />
        </div>
        <div>
          <h2 className='text-destructive text-2xl font-bold tracking-tight'>Invalid Token</h2>
          <p className='text-muted-foreground mt-2 text-sm'>{resCheckValidToken.errorMessage}</p>
        </div>
        <Link href='/forgot-password'>
          <Button variant='outline'>Request a new link</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className='mb-6 text-center'>
        <div className='flex justify-center'>
          <KeyRound className='mb-4 h-12 w-12 text-gray-400' />
        </div>
        <h2 className='text-2xl font-bold tracking-tight'>Set a new password</h2>
        <p className='text-muted-foreground text-sm'>Create a new, strong password for your account.</p>
      </div>
      <ResetPasswordForm token={token} />
    </>
  )
}

export default ResetPassword
