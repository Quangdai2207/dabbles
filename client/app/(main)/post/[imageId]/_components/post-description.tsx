import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface PostDescriptionProps {
  description: string
  categories: TPostImageDetails['categories']
}

export default function PostDescription({ description, categories }: PostDescriptionProps) {
  return (
    <div className='space-y-3'>
      {description && (
        <div className='text-foreground/90 text-[15px] leading-relaxed whitespace-pre-wrap'>{description}</div>
      )}

      {categories && categories.length > 0 && (
        <div className='flex flex-wrap gap-2 pt-1'>
          {categories.map((cat) => (
            <Link key={cat.name} href={`/search?category=${cat.slug}`}>
              <Badge
                variant='secondary'
                className='hover:bg-secondary/80 cursor-pointer rounded-md px-2 py-0.5 text-xs font-medium transition-colors'
              >
                #{cat.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
