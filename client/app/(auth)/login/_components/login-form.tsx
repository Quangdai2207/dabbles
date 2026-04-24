'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Spinner } from '@/components/ui/spinner'
import GoogleLoginComponent from '@/components/ui/google-login'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import Turnstile from 'react-turnstile'
import { useLoginLogic } from './useLoginLogic'
import { useState } from 'react'

const LoginForm = () => {
  const { form, onSubmit, captchaKey, sitekey } = useLoginLogic()
  const [showPassword, setShowPassword] = useState(false)

  if (!sitekey) {
    return null
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Mail className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
                  <Input placeholder='name@example.com' {...field} className='pl-10' />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Lock className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    {...field}
                    className='pr-10 pl-10'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none'
                  >
                    {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex items-center justify-end'>
          <Link href='/forgot-password' className='text-primary cursor-pointer text-sm font-medium hover:underline'>
            Forgot password?
          </Link>
        </div>

        <Turnstile
          sitekey={sitekey}
          key={captchaKey}
          className='mx-auto'
          onVerify={(token) => {
            form.setValue('captchaToken', token)
          }}
        />

        <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Spinner /> : null} Login
        </Button>

        <div className='relative my-6'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t border-gray-300 dark:border-gray-700' />
          </div>
          <div className='relative flex justify-center text-xs tracking-widest uppercase'>
            <span className='bg-white px-2 text-gray-500 dark:bg-black'>Or continue with</span>
          </div>
        </div>

        <GoogleLoginComponent />

        <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
          Not on Dabble yet?{' '}
          <Link href='/signup' className='text-primary cursor-pointer font-semibold hover:underline'>
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  )
}

export default LoginForm
