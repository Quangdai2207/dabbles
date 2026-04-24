'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuthStore } from '@/lib/auth-store'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import getAllCategoriesService from '@/services/category/get-all-categories'
import addCategoriesForUserService from '@/services/user/addCategoriesForUser'
import { Check, Loader2, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const DialogAddCategoriesForUser = () => {
  const { authData, token } = useAuth()
  const fetchProfile = useAuthStore((state) => state.fetchProfile)

  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<TCategory[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categorySearch, setCategorySearch] = useState('')

  useEffect(() => {
    if (authData && authData.followedCategories === false) {
      setIsOpen(true)
      fetchCategories()
    } else {
      setIsOpen(false)
    }
  }, [authData?.followedCategories, authData])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const res = await getAllCategoriesService()
      if (res.isSuccess && Array.isArray(res.data)) {
        setCategories(res.data)
      }
    } catch (error) {
      console.error('Failed to fetch categories', error)
    } finally {
      setIsLoading(false)
    }
  }

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
      const res = await addCategoriesForUserService(token, selectedCategories)
      if (res.isSuccess) {
        toast.success('Interest updated successfully!')
        await fetchProfile(token)
        setIsOpen(false)
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

  if (!authData || authData.followedCategories) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogContent
        className='bg-background w-full max-w-3xl overflow-hidden p-0 shadow-xl sm:rounded-2xl'
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <div className='flex h-[80vh] flex-col md:h-[550px]'>
          {/* Header */}
          <div className='bg-card flex flex-col items-center border-b px-8 py-8 text-center'>
            <DialogHeader className='w-full text-center sm:text-center'>
              <DialogTitle className='text-2xl font-bold tracking-tight'>Welcome to Dabble</DialogTitle>
              <DialogDescription className='text-muted-foreground mx-auto max-w-[460px] text-base'>
                Select topics that inspire you to personalize your home feed.
              </DialogDescription>
            </DialogHeader>

            {/* Search Input */}
            <div className='relative mt-6 w-full max-w-sm'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input
                className='bg-muted/40 h-10 w-full rounded-full pl-9 transition-colors'
                placeholder='Search topics...'
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
              />
            </div>
          </div>

          {/* Scrollable Content */}
          <ScrollArea className='flex-1'>
            <div className='p-8'>
              {isLoading ? (
                <div className='flex justify-center py-20'>
                  <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className='text-muted-foreground py-20 text-center text-sm'>No topics found</div>
              ) : (
                <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
                  {filteredCategories.map((category) => {
                    const isSelected = selectedCategories.includes(category.id)

                    return (
                      <button
                        key={category.id}
                        onClick={() => toggleCategory(category.id)}
                        className={cn(
                          'border-border hover:border-primary/50 hover:bg-accent relative flex h-28 flex-col items-center justify-center rounded-xl border text-center transition-all',
                          isSelected && 'border-primary bg-primary/5 ring-primary ring-1'
                        )}
                      >
                        <span className={cn('text-sm font-semibold', isSelected ? 'text-primary' : 'text-foreground')}>
                          {category.name}
                        </span>

                        {isSelected && (
                          <span className='bg-primary text-primary-foreground absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full'>
                            <Check className='h-3 w-3' strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className='bg-card flex items-center justify-between border-t px-8 py-5'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium'>{selectedCategories.length} selected</span>
              <span className='text-muted-foreground text-xs'>Minimum 1 required</span>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={selectedCategories.length === 0 || isSubmitting}
              className='rounded-full px-8'
              size='lg'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogAddCategoriesForUser
