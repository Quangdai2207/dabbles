'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import { useCategories } from '@/hooks/use-categories'
import uploadImageService from '@/services/image/upload-image'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, DollarSign, FileText, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import ImageDropzone from './_components/image-dropzone'
import CategorySelector from './_components/category-selector'

const formSchema = z.object({
  description: z.string().min(1, 'Description is required').max(500, 'Description is too long'),
  price: z.coerce.number().min(0, 'Price must be 0 or greater'),
  image: z
    .instanceof(File, { message: 'Image is required' })
    .refine((file) => file.size < 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine((file) => file.type.startsWith('image/'), 'File must be an image'),
  categoryIds: z.array(z.string()).min(1, 'Please select at least one category')
})

const UploadPage = () => {
  const { token, authData } = useAuth()
  const router = useRouter()
  const { categories } = useCategories()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      price: 0,
      image: undefined as unknown as File,
      categoryIds: [] as string[]
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!token) {
      router.push('/login')
      return
    }

    const toastId = toast.loading('Publishing your work...')

    try {
      const formData = new FormData()
      formData.append('description', values.description)
      formData.append('price', values.price.toString())
      formData.append('file', values.image)
      formData.append('categoryIds', values.categoryIds.join(','))

      const res = await uploadImageService(formData, token)

      if (res.isSuccess) {
        toast.success('Successfully published!', { id: toastId })
        router.push(`/library/${authData?.username}`)
      } else {
        toast.error(res.errorMessage || 'Failed to publish', { id: toastId })
      }
    } catch {
      toast.error('An unexpected error occurred', { id: toastId })
    }
  }

  return (
    <div className='bg-background/50 min-h-screen'>
      <div className='container mx-auto max-w-7xl'>
        <div className='mb-10 space-y-2 text-center md:text-left'>
          <h1 className='text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl'>
            Share your <span className='text-primary'>creative work</span>
          </h1>
          <p className='text-muted-foreground max-w-2xl text-lg md:text-xl'>
            Upload your masterpiece, set your price, and let the world discover your talent.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-12 lg:grid-cols-12'>
            {/* Left Column: Image Upload */}
            <div className='order-2 flex flex-col gap-6 lg:order-1 lg:col-span-7'>
              <FormField
                control={form.control}
                name='image'
                render={() => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <ImageDropzone
                        onImageChange={(file) => {
                          if (file) {
                            form.setValue('image', file)
                            form.clearErrors('image')
                          }
                        }}
                        onClear={() => form.resetField('image')}
                      />
                    </FormControl>
                    <FormMessage className='mt-2 text-center font-medium' />
                  </FormItem>
                )}
              />
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

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  {/* Price Field */}
                  <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                      <FormItem className='md:col-span-2'>
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
                              value={field.value as number | string}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className='ml-1 text-xs'>Set to 0 for free.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Category Field */}
                <FormField
                  control={form.control}
                  name='categoryIds'
                  render={({ field }) => (
                    <CategorySelector categories={categories} selectedIds={field.value} onChange={field.onChange} />
                  )}
                />

                <div className='pt-4'>
                  <Button
                    type='submit'
                    className={cn(
                      'shadow-primary/20 hover:shadow-primary/40 h-14 w-full rounded-xl text-lg font-bold shadow-lg transition-all'
                    )}
                    size='lg'
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <span className='flex items-center gap-2'>
                        Uploading... <Sparkles className='h-5 w-5 animate-spin' />
                      </span>
                    ) : (
                      <span className='flex items-center gap-2'>
                        Publish Now <ArrowRight className='h-5 w-5' />
                      </span>
                    )}
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

export default UploadPage
