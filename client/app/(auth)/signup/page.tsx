import SignupForm from '@/app/(auth)/signup/_components/signup-form'

const SignUpPage = () => {
  return (
    <>
      <div className='mb-6 text-center'>
        <h2 className='text-2xl font-bold tracking-tight'>Create an account</h2>
        <p className='text-muted-foreground text-sm'>Enter your information to create a new account.</p>
      </div>
      <SignupForm />
    </>
  )
}

export default SignUpPage
