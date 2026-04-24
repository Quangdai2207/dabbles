'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useCategories } from '@/hooks/use-categories'
import getImagesByIdService from '@/services/image/get-images-by-id'
import updateImageService from '@/services/image/update-image'
import getImageUrl from '@/lib/get-images-url'
import { useAuth } from '@/providers/AuthProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import { DollarSign, FileText, Globe, Loader2, Lock, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import CategorySelector from '@/app/(main)/uploads/_components/category-selector'

interface EditImagePageProps {
  params: Promise<{
    username: string
    imageId: string
  }>
}

const formSchema = z.object({
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  categoryIds: z.array(z.string()),
  visible: z.boolean().default(true)
})

type FormValues = z.infer<typeof formSchema>

const EditImagePage = ({ params }: EditImagePageProps) => {
  const { token, authData } = useAuth()
  const router = useRouter()
  const { categories: allCategories } = useCategories()

  const [imageId, setImageId] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      description: '',
      price: 0,
      categoryIds: [],
      visible: true
    }
  })

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params
      setImageId(resolvedParams.imageId)
    }
    unwrapParams()
  }, [params])

  useEffect(() => {
    const fetchImageDetails = async () => {
      if (!imageId || !token) return

      try {
        const res = await getImagesByIdService(imageId, token)
        if (res.isSuccess && res.data) {
          const data = res.data
          if (authData && data.creator.id !== authData.id) {
            toast.error("You don't have permission to edit this image")
            router.push('/')
            return
          }
          setImageUrl(getImageUrl(data.imageUrls.w1080))

          form.reset({
            description: data.description || '',
            price: data.price || 0,
            categoryIds: data.categories ? data.categories.map((c) => c.id) : [],
            visible: data.visible || true
          })
        } else {
          toast.error('Failed to load image details')
          router.back()
        }
      } catch (error) {
        console.error(error)
        toast.error('An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    if (imageId && token && authData) {
      fetchImageDetails()
    }
  }, [imageId, token, authData, router, form])

  const onSubmit = async (values: FormValues) => {
    if (!imageId || !token) return

    const toastId = toast.loading('Saving changes...')

    try {
      const res = await updateImageService(
        {
          description: values.description || '',
          price: values.price,
          categoryIds: values.categoryIds,
          visible: values.visible
        },
        token,
        imageId
      )

      if (res.isSuccess) {
        toast.success('Image updated successfully', { id: toastId })
        router.refresh()
        router.back()
      } else {
        toast.error(res.errorMessage || 'Failed to update image', { id: toastId })
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred while saving', { id: toastId })
    }
  }

  if (isLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Loader2 className='text-primary h-8 w-8 animate-spin' />
      </div>
    )
  }

  return (
    <div className='bg-background/50 min-h-screen'>
      <div className='container mx-auto max-w-7xl pt-6'>
        <div className='mb-10 space-y-2 text-center md:text-left'>
          <h1 className='text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl'>
            Edit your <span className='text-primary'>masterpiece</span>
          </h1>
          <p className='text-muted-foreground max-w-2xl text-lg md:text-xl'>
            Update details, manage pricing, and curate how the world sees this work.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-12 lg:grid-cols-12'>
            {/* Left Column: Image Preview */}
            <div className='order-2 flex flex-col gap-6 lg:order-1 lg:col-span-7'>
              <div className='bg-muted/5 relative flex min-h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border-none p-0'>
                {imageUrl ? (
                  <div className='relative h-full min-h-[500px] w-full'>
                    <Image
                      src={imageUrl}
                      alt='Preview'
                      fill
                      className='rounded-3xl bg-black/5 object-contain'
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className='flex flex-col items-center space-y-4 text-center'>
                    <Loader2 className='text-primary h-12 w-12 animate-spin' />
                    <p>Loading image...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Form Fields */}
            <div className='order-1 flex flex-col gap-8 lg:order-2 lg:col-span-5'>
              <div className='bg-card/50 space-y-8 rounded-3xl border p-6 shadow-sm backdrop-blur-sm md:p-8'>
                {/* Description Field */}
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2 text-lg font-semibold'>Details</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <FileText className='text-muted-foreground absolute top-4 left-4 h-5 w-5' />
                          <Textarea
                            placeholder='What is story behind this image?'
                            className='border-muted-foreground/20 focus-visible:ring-primary/20 bg-background/50 min-h-[140px] resize-none rounded-xl pt-4 pl-12 text-base transition-all'
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price Field */}
                <FormField
                  control={form.control}
                  name='price'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2 text-lg font-semibold'>Pricing</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <DollarSign className='text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2' />
                          <Input
                            type='number'
                            min='0'
                            step='0.01'
                            className='border-muted-foreground/20 focus-visible:ring-primary/20 bg-background/50 h-14 rounded-xl pl-12 text-lg transition-all'
                            placeholder='0.00'
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className='ml-1 text-xs'>Set to 0 for free.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Category Field */}
                <FormField
                  control={form.control}
                  name='categoryIds'
                  render={({ field }) => (
                    <CategorySelector
                      categories={allCategories || []}
                      selectedIds={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                <Separator />

                {/* Visibility Field */}
                <FormField
                  control={form.control}
                  name='visible'
                  render={({ field }) => (
                    <FormItem className='border-muted-foreground/20 flex flex-row items-center justify-between rounded-xl border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='flex items-center gap-2 text-base font-semibold'>
                          {field.value ? <Globe className='h-4 w-4' /> : <Lock className='h-4 w-4' />}
                          Visibility
                        </FormLabel>
                        <FormDescription>{field.value ? 'Visible to everyone' : 'Only visible to you'}</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className='pt-4'>
                  <Button
                    type='submit'
                    className='shadow-primary/20 hover:shadow-primary/40 h-14 w-full rounded-xl text-lg font-bold shadow-lg transition-all'
                    size='lg'
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <span className='flex items-center gap-2'>
                        Saving... <Loader2 className='h-5 w-5 animate-spin' />
                      </span>
                    ) : (
                      <span className='flex items-center gap-2'>
                        Save Changes <Sparkles className='h-5 w-5' />
                      </span>
                    )}
                  </Button>
                  <Button
                    type='button'
                    variant='ghost'
                    className='text-muted-foreground hover:text-foreground mt-2 h-12 w-full rounded-xl'
                    onClick={() => router.back()}
                    disabled={form.formState.isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default EditImagePage
