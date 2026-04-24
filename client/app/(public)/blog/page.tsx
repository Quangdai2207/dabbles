import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest stories, tips, and trends from the Dabble community.',
  openGraph: {
    title: 'Dabble Blog',
    description: 'Read the latest stories, tips, and trends from the Dabble community.',
    images: ['/og-image.png']
  }
}

const BLOG_POSTS = [
  {
    id: 1,
    title: 'Top 10 Interior Design Trends for 2024',
    excerpt: 'Discover the colors, textures, and styles that are defining home decor this year.',
    category: 'Design',
    date: 'Jan 15, 2024',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000',
    author: 'Sarah Jenkins'
  },
  {
    id: 2,
    title: 'Easy Weeknight Dinners That Look Fancy',
    excerpt: 'Impress your guests (or just yourself) with these simple yet stunning recipes.',
    category: 'Food',
    date: 'Jan 12, 2024',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070',
    author: 'Mike Chen'
  },
  {
    id: 3,
    title: 'A Guide to Sustainable Trave',
    excerpt: 'How to see the world while minimizing your footprint.',
    category: 'Travel',
    date: 'Jan 10, 2024',
    image: 'https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?q=80&w=2064',
    author: 'Emma Wilson'
  },
  {
    id: 4,
    title: 'DIY: Build Your Own Bookshelve',
    excerpt: 'A step-by-step guide for beginners to start woodworking.',
    category: 'DIY',
    date: 'Jan 5, 2024',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070',
    author: 'Tom Baker'
  },
  {
    id: 5,
    title: 'The Rise of Digital Art',
    excerpt: 'Exploring how technology is reshaping the way we create and consume art.',
    category: 'Technology',
    date: 'Jan 3, 2024',
    image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2070',
    author: 'Alex Rivera'
  },
  {
    id: 6,
    title: 'Photography Basics: Understanding Light',
    excerpt: 'Master the golden hour and learn how to use natural light to your advantage.',
    category: 'Photography',
    date: 'Dec 28, 2023',
    image: 'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?q=80&w=2000',
    author: 'Julia Stiles'
  },
  {
    id: 7,
    title: 'Mastering the Art of Deep Work',
    excerpt: 'Strategies to maintain focus in an increasingly distracted world.',
    category: 'Productivity',
    date: 'Dec 25, 2023',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2000',
    author: 'David Newport'
  },
  {
    id: 8,
    title: 'Urban Jungle: Guide to Indoor Plants',
    excerpt: 'Best plants for low-light apartments and how to care for them.',
    category: 'Gardening',
    date: 'Dec 22, 2023',
    image: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=2000',
    author: 'Lily Green'
  },
  {
    id: 9,
    title: 'The Perfect Morning Routine',
    excerpt: 'How to start your day with energy, purpose, and good coffee.',
    category: 'Lifestyle',
    date: 'Dec 20, 2023',
    image: 'https://images.unsplash.com/photo-1509315811345-672d83ef2fbc?q=80&w=2000',
    author: 'James Brewer'
  },
  {
    id: 10,
    title: 'The Future of Web Development',
    excerpt: 'What is next for the web ecosystem after React and server components?',
    category: 'Technology',
    date: 'Dec 18, 2023',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000',
    author: 'Sarah Code'
  },
  {
    id: 11,
    title: 'Benefits of Daily Stretching',
    excerpt: 'Why flexibility matters as you age and simple moves to start.',
    category: 'Health',
    date: 'Dec 15, 2023',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2000',
    author: 'Coach Mike'
  },
  {
    id: 12,
    title: 'Understanding Color Theory',
    excerpt: 'How to pick perfect palettes for your designs and art.',
    category: 'Art',
    date: 'Dec 10, 2023',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2000',
    author: 'Violet Palmer'
  }
]

const BlogPage = () => {
  return (
    <div className='container mx-auto mt-10 px-4 py-16 md:py-24'>
      <div className='mb-16 text-center'>
        <h1 className='mb-4 text-5xl font-bold tracking-tight text-balance text-gray-900 sm:text-6xl dark:text-white'>
          The Dabble Blog
        </h1>
        <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
          Stories, tips, and inspiration from our community and team.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
        {BLOG_POSTS.map((post) => (
          <div
            key={post.id}
            className='group flex flex-col overflow-hidden rounded-2xl border bg-white transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900'
          >
            <div className='relative h-64 w-full overflow-hidden'>
              <Image
                src={post.image}
                alt={post.title}
                layout='fill'
                objectFit='cover'
                className='transition-transform duration-500 group-hover:scale-105'
              />
              <div className='absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-black backdrop-blur-sm'>
                {post.category}
              </div>
            </div>
            <div className='flex flex-1 flex-col p-6'>
              <div className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                {post.date} • By {post.author}
              </div>
              <h3 className='group-hover:text-primary mb-3 text-xl leading-tight font-bold text-gray-900 dark:text-white'>
                {post.title}
              </h3>
              <p className='mb-4 flex-1 text-gray-600 dark:text-gray-300'>{post.excerpt}</p>
              <Link href='#' className='text-primary font-semibold hover:underline'>
                Read more →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-16 flex justify-center'>
        <Button variant='outline' size='lg'>
          Load More Articles
        </Button>
      </div>
    </div>
  )
}

export default BlogPage
