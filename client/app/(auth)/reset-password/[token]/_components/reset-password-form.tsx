'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import resetPasswordService from '@/services/auth/reset-password'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/, {
        error:
          'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
      }),
    passwordConfirm: z.string().min(1, { error: 'Password confirmation is required' })
  })
  .refine((data) => data.password === data.passwordConfirm, {
    error: "Passwords don't match",
    path: ['passwordConfirm']
  })

const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      passwordConfirm: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await resetPasswordService({ token, ...values })
      if (!res.isSuccess) {
        toast.error(res.errorMessage || 'Reset password failed')
        return
      }
      toast.success('Password reset successfully')
      router.push('/login') // Redirect to login page after successful password reset
    } catch {
      toast.error('Reset password failed. Please try again.')
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Lock className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your new password'
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
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Lock className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Confirm your new password'
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
        <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Spinner /> : null}Reset Password
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

export default ResetPasswordForm
