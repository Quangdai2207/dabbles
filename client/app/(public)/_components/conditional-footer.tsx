'use client'

import Footer from '@/components/partials/footer'
import { usePathname } from 'next/navigation'

const ConditionalFooter = () => {
  const pathname = usePathname()
  const isExplorePage = pathname.startsWith('/explore')

  if (isExplorePage) return null
  return <Footer />
}

export default ConditionalFooter
