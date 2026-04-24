import { Suspense } from 'react'
import ForceReload from './_components/force-reload'
import CheckPaymentContent from './_components/check-payment-content'
import GetAuthToken from '@/lib/get-auth-token'

const CheckPaymentPage = async () => {
  const token = await GetAuthToken()
  if (!token) {
    return <ForceReload />
  }
  return (
    <Suspense fallback={<div className='flex h-screen items-center justify-center'>Loading...</div>}>
      <CheckPaymentContent token={token} />
    </Suspense>
  )
}

export default CheckPaymentPage
