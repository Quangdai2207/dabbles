'use client'

import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Search, Tag } from 'lucide-react'
import { useState } from 'react'

interface CategorySelectorProps {
  categories: TCategory[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

const CategorySelector = ({ categories, selectedIds, onChange }: CategorySelectorProps) => {
  const [categorySearch, setCategorySearch] = useState('')

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  )

  return (
    <FormItem>
      <FormLabel className='flex items-center gap-2 text-lg font-semibold'>Tags</FormLabel>

      <div className='group relative mb-4'>
        <Search className='text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transition-colors' />
        <Input
          placeholder='Search tags...'
          className='border-muted-foreground/20 bg-background/50 h-11 rounded-full pl-10'
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
        />
      </div>

      <FormControl>
        <div className='scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent flex max-h-[200px] flex-wrap gap-2 overflow-y-auto p-1 pr-2'>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => {
              const isSelected = selectedIds.includes(category.id)
              return (
                <div
                  key={category.id}
                  onClick={() => {
                    if (isSelected) {
                      onChange(selectedIds.filter((id) => id !== category.id))
                    } else {
                      onChange([...selectedIds, category.id])
                    }
                  }}
                  className={cn(
                    'inline-flex cursor-pointer items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 select-none',
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent'
                  )}
                >
                  {isSelected ? <Tag className='mr-1.5 h-3 w-3' /> : null}
                  {category.name}
                </div>
              )
            })
          ) : (
            <p className='text-muted-foreground py-2 text-sm italic'>No categories found.</p>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default CategorySelector
