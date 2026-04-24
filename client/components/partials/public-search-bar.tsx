'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Search, Loader2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useCategories } from '@/hooks/use-categories'
import useDebounce from '@/hooks/use-debounce'
import searchUsersService from '@/services/user/search-users'
import Image from 'next/image'
import getImageUrl from '@/lib/get-images-url'

const EMPTY_CATEGORIES: TCategory[] = []

interface PublicSearchBarProps {
  className?: string
}

const PublicSearchBar = ({ className }: PublicSearchBarProps) => {
  const { categories } = useCategories()
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [foundUsers, setFoundUsers] = useState<TSearchUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim() || !categories) return EMPTY_CATEGORIES
    return categories.filter((category) => category.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [categories, searchQuery])

  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedSearchQuery.trim()) {
        setFoundUsers([])
        return
      }

      setIsLoading(true)
      try {
        const response = await searchUsersService(debouncedSearchQuery, null)
        if (response.isSuccess && response.data) {
          setFoundUsers(response.data)
        } else {
          setFoundUsers([])
        }
      } catch (error) {
        console.error('Error searching users:', error)
        setFoundUsers([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [debouncedSearchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const hasResults = filteredCategories.length > 0 || foundUsers.length > 0
  const showResults = isFocused && searchQuery

  const clearSearch = () => {
    setSearchQuery('')
    setFoundUsers([])
  }

  return (
    <div className={`w-full max-w-md items-center justify-center ${className ?? ''}`}>
      <div className='relative w-full' ref={searchContainerRef}>
        <div className='group relative'>
          <Search className='text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors' />
          <Input
            type='text'
            placeholder='Search categories or users...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className={
              'bg-secondary/50 hover:bg-secondary/80 focus-visible:bg-background h-10 w-full rounded-full border-none pr-10 pl-10 shadow-sm transition-all duration-200 focus-visible:ring-1 focus-visible:ring-offset-0'
            }
          />
          {isLoading ? (
            <Loader2 className='text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin' />
          ) : searchQuery ? (
            <button
              onClick={clearSearch}
              className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 outline-none'
            >
              <X className='h-4 w-4' />
            </button>
          ) : null}
        </div>

        {showResults && (
          <div className='bg-popover/95 text-popover-foreground animate-in fade-in-0 zoom-in-95 absolute top-full left-0 mt-1 w-full overflow-hidden rounded-xl border p-2 shadow-xl backdrop-blur-md'>
            <div className='max-h-[60vh] overflow-y-auto pr-1'>
              {!hasResults && !isLoading ? (
                <div className='text-muted-foreground py-6 text-center text-sm'>
                  No results found for <span className='font-semibold'>&quot;{searchQuery}&quot;</span>
                </div>
              ) : (
                <>
                  {filteredCategories.length > 0 && (
                    <div className='mb-2'>
                      <h4 className='text-muted-foreground mb-1 px-3 py-1.5 text-xs font-bold tracking-wider uppercase'>
                        Tags
                      </h4>
                      <div className='grid gap-1'>
                        {filteredCategories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/explore/search?category=${category.slug}`}
                            onClick={() => {
                              setSearchQuery(category.name)
                              setIsFocused(false)
                            }}
                            className='hover:bg-accent hover:text-accent-foreground flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors'
                          >
                            <Search className='text-muted-foreground/70 mr-2 h-3.5 w-3.5' />
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredCategories.length > 0 && foundUsers.length > 0 && (
                    <div className='bg-border my-2 h-px w-full' />
                  )}

                  {foundUsers.length > 0 && (
                    <div>
                      <h4 className='text-muted-foreground mb-1 px-3 py-1.5 text-xs font-bold tracking-wider uppercase'>
                        Users
                      </h4>
                      <div className='grid gap-1'>
                        {foundUsers.map((user) => (
                          <Link
                            key={user.id}
                            href={`/explore/library/${user.username}`}
                            onClick={() => {
                              setSearchQuery(user.name)
                              setIsFocused(false)
                            }}
                            className='hover:bg-accent hover:text-accent-foreground group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'
                          >
                            <div className='border-border relative h-8 w-8 overflow-hidden rounded-full border shadow-sm'>
                              <Image
                                src={getImageUrl(user.avatar)}
                                alt={user.name}
                                fill
                                className='object-cover'
                                unoptimized
                              />
                            </div>
                            <div className='flex flex-col'>
                              <span className='text-sm leading-none font-medium'>{user.name}</span>
                              <span className='text-muted-foreground text-xs font-normal'>@{user.username}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicSearchBar
