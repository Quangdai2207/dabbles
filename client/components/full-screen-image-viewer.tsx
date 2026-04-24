'use client'

import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import Image from 'next/image'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

interface FullScreenImageViewerProps {
  isOpen: boolean
  onClose: () => void
  src: string
  alt: string
}

export function FullScreenImageViewer({ isOpen, onClose, src, alt }: FullScreenImageViewerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='flex h-screen w-screen max-w-[100vw] items-center justify-center overflow-hidden border-none bg-black/95 p-0 focus-visible:outline-none'>
        <VisuallyHidden.Root>
          <DialogTitle>Full Screen Image View</DialogTitle>
        </VisuallyHidden.Root>

        {/* Custom Close Button */}
        <DialogClose className='absolute top-5 right-5 z-50 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 focus:outline-none'>
          <X className='h-6 w-6' />
          <span className='sr-only'>Close</span>
        </DialogClose>

        <div
          className='relative flex h-full w-full items-center justify-center p-2 sm:p-4 md:p-10'
          onContextMenu={(e) => e.preventDefault()}
        >
          <Image src={src} alt={alt} fill className='object-contain' priority unoptimized />
        </div>
      </DialogContent>
    </Dialog>
  )
}
