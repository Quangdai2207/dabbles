'use client'

import { useEffect, useRef } from 'react'

const tags = [
  'Home Decor',
  'DIY Projects',
  'Green Thumb',
  'Fashion',
  'Recipes',
  'Wellness',
  'Travel',
  'Tech',
  'Art',
  'Photography',
  'Design',
  'Woodworking'
]

const TextMarquee = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useRef(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let rafId: number
    const speed = 0.5 // px / frame

    const animate = () => {
      x.current -= speed

      // khi block đầu chạy hết thì reset
      if (Math.abs(x.current) >= el.scrollWidth / 2) {
        x.current = 0
      }

      el.style.transform = `translateX(${x.current}px)`
      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(rafId)
  }, [])
  return (
    <section className='bg-primary/5 w-full overflow-hidden py-12'>
      <div className='flex w-max' ref={containerRef}>
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className='flex shrink-0 gap-8 px-8 whitespace-nowrap'>
            {tags.map((tag, i) => (
              <span key={i} className='text-primary/20 text-4xl font-black tracking-widest uppercase'>
                {tag}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

export default TextMarquee
