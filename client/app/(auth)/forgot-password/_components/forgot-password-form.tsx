'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import Link from 'next/link'
import { Spinner } from '@/components/ui/spinner'
import forgotPasswordService from '@/services/auth/forgot-password'
import { useState } from 'react'
import { ArrowLeft, Mail, Send } from 'lucide-react'

const formSchema = z.object({
  email: z
    .string()
    .min(1, { error: 'Email is required' })
    .pipe(z.email({ error: 'Invalid email address' }))
})

const ForgotPasswordForm = () => {
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await forgotPasswordService(values)
      if (!res.isSuccess) {
        toast.error(res.errorMessage || 'Failed to send reset instructions. Please try again.')
        return
      }
      toast.success('Password reset instructions have been sent to your email.')
      setSubmittedEmail(values.email)
      setIsEmailSent(true)
    } catch {
      toast.error('Failed to send reset instructions. Please try again.')
    }
  }

  const handleTryAgain = () => {
    setIsEmailSent(false)
    setSubmittedEmail('')
    form.reset()
  }

  if (isEmailSent) {
    return (
      <div className='space-y-6 text-center'>
        <div className='flex justify-center'>
          <Send className='h-12 w-12 text-gray-400' />
        </div>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Check your email</h2>
          <p className='text-muted-foreground mt-2 text-sm'>
            We&apos;ve sent a password reset link to{' '}
            <span className='text-primary font-semibold'>{submittedEmail}</span>.
          </p>
        </div>
        <Button onClick={handleTryAgain} variant='outline'>
          Didn&apos;t receive it? Try again
        </Button>
        <div className='mt-4 text-sm'>
          <Link
            href='/login'
            className='text-muted-foreground hover:text-primary flex items-center justify-center gap-2'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to login
          </Link>
        </div>
      </div>
    )
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

        <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Spinner /> : null} Send Reset Link
        </Button>

        <div className='mt-4 text-sm'>
          <Link
            href='/login'
            className='text-muted-foreground hover:text-primary flex items-center justify-center gap-2'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to login
          </Link>
        </div>
      </form>
    </Form>
  )
}

export default ForgotPasswordForm
