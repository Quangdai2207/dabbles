'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const ScrollToTop = () => {
  const pathName = usePathname()
  useEffect(() => {
    const scrollArea = document.querySelector('#main-scroll-area [data-radix-scroll-area-viewport]')
    if (scrollArea) {
      scrollArea.scrollTo(0, 0)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathName])

  return null
}

export default ScrollToTop
