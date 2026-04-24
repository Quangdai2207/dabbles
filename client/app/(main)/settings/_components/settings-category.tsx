'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuthStore } from '@/lib/auth-store'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import getFollowedCategoriesByUser from '@/services/category/get-followed-categories-by-user'
import getAllCategoriesService from '@/services/category/get-all-categories'
import updateCategoriesForUserService from '@/services/user/updateCategoriesForUser'
import { Check, Loader2, Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

const SettingsCategory = () => {
  const { token } = useAuth()
  const fetchProfile = useAuthStore((state) => state.fetchProfile)

  const [categories, setCategories] = useState<TCategory[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categorySearch, setCategorySearch] = useState('')

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [allCategoriesRes, followedCategoriesRes] = await Promise.all([
        getAllCategoriesService(),
        getFollowedCategoriesByUser(token)
      ])

      if (allCategoriesRes.isSuccess && Array.isArray(allCategoriesRes.data)) {
        setCategories(allCategoriesRes.data)
      }

      if (followedCategoriesRes.isSuccess && Array.isArray(followedCategoriesRes.data)) {
        setSelectedCategories(followedCategoriesRes.data.map((cat) => cat.id))
      }
    } catch (error) {
      console.error('Failed to fetch data', error)
      toast.error('Failed to load categories')
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [token, fetchData])

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    )
  }

  const handleSubmit = async () => {
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category')
      return
    }
    if (!token) return

    setIsSubmitting(true)
    try {
      const res = await updateCategoriesForUserService(token, selectedCategories)
      if (res.isSuccess) {
        toast.success('Interest updated successfully!')
        await fetchProfile(token)
      } else {
        toast.error(res.errorMessage || 'Failed to update interest')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  )

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage your interests and personalization settings.</CardDescription>
        </CardHeader>
        <CardContent className='flex h-[400px] items-center justify-center'>
          <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardDescription>Select topics that inspire you to personalize your home feed.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Search Input */}
        <div className='relative w-full'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <Input
            className='bg-muted/40 h-10 w-full rounded-full pl-9 transition-colors'
            placeholder='Search topics...'
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
          />
        </div>

        {/* Categories Grid */}
        <ScrollArea className='h-[400px] rounded-md border p-4'>
          {filteredCategories.length === 0 ? (
            <div className='text-muted-foreground flex h-full items-center justify-center py-20 text-center text-sm'>
              No topics found
            </div>
          ) : (
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
              {filteredCategories.map((category) => {
                const isSelected = selectedCategories.includes(category.id)

                return (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      'relative flex h-24 flex-col items-center justify-center rounded-xl border-2 text-center transition-all',
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'bg-card hover:border-primary/50 hover:bg-accent text-foreground border-border'
                    )}
                  >
                    <span className='text-sm font-semibold'>{category.name}</span>

                    {isSelected && (
                      <span className='bg-primary text-primary-foreground absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full'>
                        <Check className='h-2.5 w-2.5' strokeWidth={3} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </ScrollArea>

        <div className='flex justify-end pt-4'>
          <Button onClick={handleSubmit} disabled={isSubmitting} className='min-w-[120px]'>
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default SettingsCategory
