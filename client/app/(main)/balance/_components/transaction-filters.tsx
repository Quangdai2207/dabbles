'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

export default function TransactionFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [date, setDate] = useState<DateRange | undefined>({
    from: searchParams.get('fromDate') ? new Date(searchParams.get('fromDate')!) : undefined,
    to: searchParams.get('toDate') ? new Date(searchParams.get('toDate')!) : undefined
  })

  // Sort state
  // null = default
  // price_desc, price_asc
  // date_desc, date_asc
  const getCurrentSort = () => {
    if (searchParams.get('sortByPriceDesc') === 'true') return 'price_desc'
    if (searchParams.get('sortByPriceDesc') === 'false') return 'price_asc'
    if (searchParams.get('sortByCreatedDateDesc') === 'true') return 'date_desc'
    if (searchParams.get('sortByCreatedDateDesc') === 'false') return 'date_asc'
    return 'date_desc' // default
  }

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    // Reset all sorts first
    params.delete('sortByPriceDesc')
    params.delete('sortByCreatedDateDesc')

    if (value === 'price_desc') params.set('sortByPriceDesc', 'true')
    if (value === 'price_asc') params.set('sortByPriceDesc', 'false')
    if (value === 'date_desc') params.set('sortByCreatedDateDesc', 'true')
    if (value === 'date_asc') params.set('sortByCreatedDateDesc', 'false')

    router.push(`?${params.toString()}`)
  }

  const handleDateSelect = (newDate: DateRange | undefined) => {
    setDate(newDate)
    const params = new URLSearchParams(searchParams.toString())
    if (newDate?.from) {
      params.set('fromDate', format(newDate.from, 'yyyy-MM-dd'))
    } else {
      params.delete('fromDate')
    }
    if (newDate?.to) {
      params.set('toDate', format(newDate.to, 'yyyy-MM-dd'))
    } else {
      params.delete('toDate')
    }
    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    setDate(undefined)
    const params = new URLSearchParams(searchParams.toString())
    params.delete('fromDate')
    params.delete('toDate')
    params.delete('sortByPriceDesc')
    // Keep tab and page if needed, or maybe reset page?
    params.delete('page')
    // Default sort is date_desc, so removing params effectively resets to default
    params.delete('sortByCreatedDateDesc')

    router.push(`?${params.toString()}`)
  }

  return (
    <div className='flex flex-wrap items-center gap-4'>
      {/* Date Range Picker */}
      <div className='grid gap-2'>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id='date'
              variant={'outline'}
              className={cn('w-[260px] justify-start text-left font-normal', !date?.from && 'text-muted-foreground')}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              initialFocus
              mode='range'
              {...(date?.from ? { defaultMonth: date.from } : {})}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Sort Select */}
      <Select value={getCurrentSort()} onValueChange={handleSortChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Sort by' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='date_desc'>Newest First</SelectItem>
          <SelectItem value='date_asc'>Oldest First</SelectItem>
          <SelectItem value='price_desc'>Price: High to Low</SelectItem>
          <SelectItem value='price_asc'>Price: Low to High</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {searchParams.get('fromDate') ||
      searchParams.get('toDate') ||
      searchParams.get('sortByPriceDesc') ||
      searchParams.get('sortByCreatedDateDesc') ? (
        <Button variant='ghost' onClick={clearFilters} size='icon'>
          <X className='h-4 w-4' />
        </Button>
      ) : null}
    </div>
  )
}
