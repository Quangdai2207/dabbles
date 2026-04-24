'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import getImageUrl from '@/lib/get-images-url'
import { Camera } from 'lucide-react'
import { useRouter } from 'next/navigation'

const accountFormSchema = z.object({
  username: z.string().min(2, { message: 'Username must be at least 2 characters.' }),
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  phone: z.string().regex(/^\d{10,11}$/, { message: 'Phone number must be valid (10-11 digits).' }),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' })
})

type AccountFormValues = z.infer<typeof accountFormSchema>

interface ProfileCardProps {
  authData: TProfile | null
  token: string | null
  updateProfile: (token: string, formData: FormData) => Promise<void>
}

const ProfileCard = ({ authData, token, updateProfile }: ProfileCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const router = useRouter()

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: ''
    }
  })

  useEffect(() => {
    if (authData) {
      form.reset({
        username: authData.username || '',
        firstName: authData.firstName || '',
        lastName: authData.lastName || '',
        phone: authData.phone || '',
        dateOfBirth: authData.dob ? new Date(authData.dob).toISOString().split('T')[0] : ''
      })
    }
  }, [authData, form])

  const onSubmit = async (data: AccountFormValues) => {
    if (!token || !authData) return

    const initialDateOfBirth = authData.dob ? new Date(authData.dob).toISOString().split('T')[0] : ''

    const isUnchanged =
      !avatarFile &&
      data.username === (authData.username || '') &&
      data.firstName === (authData.firstName || '') &&
      data.lastName === (authData.lastName || '') &&
      data.phone === (authData.phone || '') &&
      data.dateOfBirth === initialDateOfBirth

    if (isUnchanged) return

    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    if (avatarFile) {
      formData.append('avatar', avatarFile)
    }

    await updateProfile(token, formData)
    setAvatarFile(null)
    form.reset(data)
    router.refresh()
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarFile(file)
    }
  }

  const displayAvatar = avatarFile
    ? URL.createObjectURL(avatarFile)
    : authData?.avatar
      ? getImageUrl(authData.avatar)
      : null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>View and update your account details below.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='mb-6 flex flex-col items-center gap-4'>
          <div className='group relative cursor-pointer' onClick={handleAvatarClick}>
            <div className='border-muted h-32 w-32 overflow-hidden rounded-full border-2 shadow-sm'>
              {displayAvatar ? (
                <Image
                  src={displayAvatar}
                  alt='Avatar'
                  width={128}
                  height={128}
                  className='h-full w-full object-cover'
                  unoptimized
                  priority
                />
              ) : (
                <div className='bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-2xl font-bold uppercase'>
                  {authData?.firstName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100'>
              <Camera className='h-6 w-6 text-white' />
            </div>
          </div>
          <Button variant='outline' size='sm' onClick={handleAvatarClick}>
            Change Avatar
          </Button>
          <input type='file' ref={fileInputRef} className='hidden' accept='image/*' onChange={handleFileChange} />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid gap-2'>
              <Label>Email</Label>
              <Input value={authData?.email || ''} disabled readOnly className='bg-muted/50' />
            </div>

            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='johndoe' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='John' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Doe' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='dateOfBirth'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input {...field} type='date' />
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='0123456789' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex justify-end pt-4'>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ProfileCard
