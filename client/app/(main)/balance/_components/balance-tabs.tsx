'use client'

import { Tabs } from '@/components/ui/tabs'
import { useRouter, useSearchParams } from 'next/navigation'

interface BalanceTabsProps {
  defaultTab: string
  validTabs: string[]
  children: React.ReactNode
}

export default function BalanceTabs({ defaultTab, validTabs, children }: BalanceTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || defaultTab

  const handleTabChange = (value: string) => {
    if (validTabs.includes(value)) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('tab', value)
      params.set('page', '1') // Reset page on tab change

      // Clear filters on tab change
      params.delete('fromDate')
      params.delete('toDate')
      params.delete('sortByPriceDesc')
      params.delete('sortByCreatedDateDesc')

      router.push(`?${params.toString()}`, { scroll: false })
    }
  }

  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className='w-full'>
      {children}
    </Tabs>
  )
}
