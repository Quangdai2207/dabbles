'use client'

import ForgotPasswordForm from './_components/forgot-password-form'

const ForgotPasswordPage = () => {
  return (
    <>
      <div className='mb-6 text-center'>
        <h2 className='text-2xl font-bold tracking-tight'>Forgot your password?</h2>
        <p className='text-muted-foreground text-sm'>
          No worries! Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>
      <ForgotPasswordForm />
    </>
  )
}

export default ForgotPasswordPage
