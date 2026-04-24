'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Spinner } from '@/components/ui/spinner'
import { Calendar, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react'
import Turnstile from 'react-turnstile'
import { useSignupLogic } from './useSignupLogic'
import { useState } from 'react'

const SignupForm = () => {
  const { form, onSubmit, captchaKey, sitekey } = useSignupLogic()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  if (!sitekey) {
    return null
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div className='flex gap-4'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <User className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
                    <Input placeholder='John' {...field} value={field.value || ''} className='pl-10' />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <User className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
                    <Input placeholder='Doe' {...field} value={field.value || ''} className='pl-10' />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <div className='relative'>
                  <User className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
                  <Input placeholder='johndoe' {...field} value={field.value || ''} className='pl-10' />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Mail className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
                  <Input placeholder='name@example.com' {...field} value={field.value || ''} className='pl-10' />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Phone className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
                  <Input placeholder='1234567890' {...field} value={field.value || ''} className='pl-10' />
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
                    value={field.value || ''}
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
        <FormField
          control={form.control}
          name='passwordConfirm'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Lock className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Confirm your password'
                    {...field}
                    value={field.value || ''}
                    className='pr-10 pl-10'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none'
                  >
                    {showConfirmPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dateOfBirth'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Calendar className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
                  <Input type='date' {...field} value={field.value || ''} className='pl-10' />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Turnstile
          sitekey={sitekey}
          onVerify={(token) => {
            form.setValue('captchaToken', token)
          }}
          key={captchaKey}
          className='mx-auto'
        />
        <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Spinner /> : null} Sign Up
        </Button>

        <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
          Already a member?{' '}
          <Link href='/login' className='text-primary cursor-pointer font-semibold hover:underline'>
            Log in
          </Link>
        </p>
      </form>
    </Form>
  )
}

export default SignupForm
