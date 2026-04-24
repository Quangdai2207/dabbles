import LoginForm from '@/app/(auth)/login/_components/login-form'

const LoginPage = () => {
  return (
    <>
      <div className='mb-6 text-center'>
        <h2 className='text-2xl font-bold tracking-tight'>Log in to your account</h2>
        <p className='text-muted-foreground text-sm'>Enter your email and password to access your account.</p>
      </div>
      <LoginForm />
    </>
  )
}

export default LoginPage
