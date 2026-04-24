import React from 'react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const MainContent = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ScrollArea className='h-full' id='main-scroll-area'>
      <main className='w-full p-4 pb-20 md:pb-4'>{children}</main>
      <ScrollBar orientation='vertical' />
    </ScrollArea>
  )
}

export default MainContent
