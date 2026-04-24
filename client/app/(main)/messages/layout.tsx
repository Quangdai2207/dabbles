import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Messages',
  description: 'An all-in-one platform to showcase and discover creative work.'
}

const MessageLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <>{children}</>
}

export default MessageLayout
