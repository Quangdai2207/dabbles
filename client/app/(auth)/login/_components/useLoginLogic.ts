import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { loginService } from '@/services/auth/login'

const formSchema = z.object({
  email: z
    .string()
    .min(1, { error: 'Email is required' })
    .pipe(z.email({ error: 'Invalid email address' })),
  password: z.string().min(1, { error: 'Password is required' }),
  captchaToken: z.string().min(1, { error: 'Captcha is required' })
})

export const useLoginLogic = () => {
  const [captchaKey, setCaptchaKey] = useState<number>(0)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      captchaToken: ''
    }
  })

  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await loginService(values)
      if (!res.isSuccess) {
        toast.error(res.errorMessage || 'Failed to login. Please try again.')
        setCaptchaKey((prev) => prev + 1)
        return
      }
      router.push('/')
      router.refresh()
      toast.success('Login successfully')
    } catch {
      toast.error('Failed to login. Please try again.')
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
