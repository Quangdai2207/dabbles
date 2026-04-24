'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Sparkles, X } from 'lucide-react'
import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'

interface ImageDropzoneProps {
  onImageChange: (file: File | undefined) => void
  onClear: () => void
}

const ImageDropzone = ({ onImageChange, onClear }: ImageDropzoneProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleImageChange = (file: File | undefined) => {
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      onImageChange(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleImageChange(file)
    }
  }

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClear()
  }

  return (
    <div
      className={cn(
        'group bg-muted/5 relative flex min-h-[500px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out',
        isDragging
          ? 'border-primary bg-primary/5 scale-[0.99]'
          : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/10',
        previewUrl ? 'border-none p-0' : 'p-12'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => (!previewUrl ? fileInputRef.current?.click() : null)}
    >
      {previewUrl ? (
        <div className='relative h-full min-h-[500px] w-full'>
          <Image src={previewUrl} alt='Preview' fill className='rounded-3xl bg-black/5 object-contain' />
          <div className='absolute inset-0 rounded-3xl bg-black/0 transition-colors duration-300 group-hover:bg-black/10' />

          <Button
            type='button'
            variant='destructive'
            size='icon'
            className='absolute top-4 right-4 z-20 h-10 w-10 scale-90 rounded-full opacity-0 shadow-lg transition-opacity group-hover:opacity-100 hover:scale-100'
            onClick={(e) => {
              e.stopPropagation()
              clearImage()
            }}
          >
            <X className='h-5 w-5' />
          </Button>
          <div className='absolute right-4 bottom-4 z-20 opacity-0 transition-opacity group-hover:opacity-100'>
            <Button
              type='button'
              variant='secondary'
              size='sm'
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              Change Image
            </Button>
          </div>
        </div>
      ) : (
        <div className='animate-in fade-in zoom-in-95 flex flex-col items-center space-y-4 text-center duration-500'>
          <div className='relative'>
            <div className='bg-primary/5 absolute -inset-4 rounded-full blur-xl' />
            <div className='bg-background ring-border relative rounded-full p-6 shadow-sm ring-1'>
              <Sparkles className='text-primary h-12 w-12' />
            </div>
          </div>
          <div className='max-w-xs space-y-2'>
            <h3 className='text-2xl font-bold'>Drag & Drop</h3>
            <p className='text-muted-foreground font-medium'>or click to browse from your computer</p>
          </div>
          <div className='pt-4'>
            <p className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
              Supports JPG, PNG, WEBP
            </p>
          </div>
        </div>
      )}
      <Input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={(e) => handleImageChange(e.target.files?.[0])}
      />
    </div>
  )
}

export default ImageDropzone
