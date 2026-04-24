import getImageUrl from '@/lib/get-images-url'
import { memo, useMemo } from 'react'
import Image from 'next/image'

const Avatar = memo(function Avatar({ avatar, name }: { avatar?: string; name: string }) {
  const image = useMemo(() => getImageUrl(avatar), [avatar])

  if (!avatar) {
    return (
      <div className='bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-[10px]'>
        {name.charAt(0)}
      </div>
    )
  }

  return <Image src={image} alt={name} fill className='object-cover' loading='lazy' unoptimized />
})

export default Avatar
