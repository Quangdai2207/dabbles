'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/providers/AuthProvider'
import React from 'react'

interface LibraryProps {
  username: string
  postsContent: React.ReactNode
  likedContent: React.ReactNode
  purchasedContent: React.ReactNode
}

const Library = ({ username, postsContent, likedContent, purchasedContent }: LibraryProps) => {
  const { authData } = useAuth()
  const isOwner = authData?.username === username

  return (
    <div className='w-full'>
      <Tabs defaultValue='posts' className='w-full space-y-6' id='library-tabs'>
        <div className='flex items-center justify-between'>
          <TabsList className='bg-background h-auto w-full justify-start rounded-none p-0 pb-1'>
            <TabsTrigger
              value='posts'
              className='data-[state=active]:border-primary rounded-none border-b-2 border-white px-6 py-3 text-base data-[state=active]:bg-transparent data-[state=active]:shadow-none'
            >
              Posts
            </TabsTrigger>
            {isOwner ? (
              <>
                <TabsTrigger
                  value='liked'
                  className='data-[state=active]:border-primary rounded-none border-b-2 border-white px-6 py-3 text-base data-[state=active]:bg-transparent data-[state=active]:shadow-none'
                >
                  Liked
                </TabsTrigger>
                <TabsTrigger
                  value='purchased'
                  className='data-[state=active]:border-primary rounded-none border-b-2 border-white px-6 py-3 text-base data-[state=active]:bg-transparent data-[state=active]:shadow-none'
                >
                  Purchased
                </TabsTrigger>
              </>
            ) : null}
          </TabsList>
        </div>
        {postsContent}
        {isOwner ? likedContent : null}
        {isOwner ? purchasedContent : null}
      </Tabs>
    </div>
  )
}

export default Library
