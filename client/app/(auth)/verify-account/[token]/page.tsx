import verifyAccountService from '@/services/auth/verify-account'
import { Button } from '@/components/ui/button'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const VerifyAccount = async ({ params }: { params: Promise<{ token: string }> }) => {
  const { token } = await params
  const resVerifyAccount = await verifyAccountService(token)

  if (resVerifyAccount.isSuccess) {
    return (
      <div className='space-y-6 text-center'>
        <div className='flex justify-center'>
          <CheckCircle className='h-12 w-12 text-green-500' />
        </div>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Verification Successful</h2>
          <p className='text-muted-foreground mt-2 text-sm'>Your account has been successfully verified.</p>
        </div>
        <Button asChild className='w-full'>
          <Link href={'/login'}>Go to Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-6 text-center'>
      <div className='flex justify-center'>
        <AlertTriangle className='text-destructive h-12 w-12' />
      </div>
      <div>
        <h2 className='text-destructive text-2xl font-bold tracking-tight'>Verification Failed</h2>
        <p className='text-muted-foreground mt-2 text-sm'>{resVerifyAccount.errorMessage}</p>
      </div>
      <p className='text-muted-foreground text-center text-sm'>
        Please try requesting a new verification link or contact support.
      </p>
    </div>
  )
}

export default VerifyAccount
