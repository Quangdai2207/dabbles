import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { registerService } from '@/services/auth/register'

const formSchema = z
  .object({
    firstName: z.string().min(1, { error: 'First name is required' }),
    lastName: z.string().min(1, { error: 'Last name is required' }),
    username: z.string().min(1, { error: 'Username is required' }),
    email: z
      .string()
      .min(1, { error: 'Email is required' })
      .pipe(z.email({ error: 'Invalid email address' })),
    phone: z
      .string()
      .min(1, { error: 'Phone number is required' })
      .regex(/^\d{10}$/, { error: 'Phone number must be 10 digits' }),
    password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/, {
        error:
          'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
      }),
    passwordConfirm: z.string().min(1, { error: 'Password confirmation is required' }),
    dateOfBirth: z.string().min(1, { error: 'Date of birth is required' }),
    captchaToken: z.string().min(1, { error: 'Captcha is required' })
  })
  .refine((data) => data.password === data.passwordConfirm, {
    error: "Passwords don't match",
    path: ['passwordConfirm']
  })

export const useSignupLogic = () => {
  const [captchaKey, setCaptchaKey] = useState<number>(0)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      passwordConfirm: '',
      dateOfBirth: '',
      captchaToken: ''
    }
  })

  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Create a copy or modify directly? zod types usually immutable in intent but here it's just an object
      const payload = { ...values }
      payload.dateOfBirth = new Date(payload.dateOfBirth).toLocaleDateString('en-GB').replace(/-/g, '/')

      const res = await registerService(payload)
      if (!res.isSuccess) {
        toast.error(res.errorMessage || 'Sign up failed')
        setCaptchaKey((prev) => prev + 1)
        return
      }
      toast.success(
        `Sign up successfully. Please verify your email address at ${values.email} to activate your account.`
      )
      router.push('/login')
    } catch {
      toast.error('Sign up failed. Please try again.')
      setCaptchaKey((prev) => prev + 1)
    }
  }

  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  return {
    form,
    onSubmit,
    captchaKey,
    sitekey
  }
}
