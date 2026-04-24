import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Dabble | Library',
  description: 'An all-in-one platform to showcase and discover creative work.'
}

const LibraryLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <>{children}</>
}

export default LibraryLayout
