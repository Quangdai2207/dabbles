'use client'

import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Settings, Bell, Shield } from 'lucide-react'

const SettingsSidebar = () => {
  return (
    <aside className='sticky top-6 h-fit self-start lg:w-1/4'>
      <TabsList className='flex h-auto w-full flex-col justify-start gap-2 bg-transparent p-0'>
        <TabsTrigger
          value='account'
          className='data-[state=active]:bg-muted data-[state=active]:text-foreground w-full justify-start gap-2 px-3 py-2 text-left'
        >
          <User className='h-4 w-4' /> Account
        </TabsTrigger>
        <TabsTrigger
          value='notifications'
          disabled
          className='w-full cursor-not-allowed justify-between gap-2 px-3 py-2 text-left opacity-50'
        >
          <div className='flex items-center gap-2'>
            <Bell className='h-4 w-4' /> Notifications
          </div>
          <span className='bg-muted-foreground/20 text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-medium'>
            Soon
          </span>
        </TabsTrigger>
        <TabsTrigger
          value='appearance'
          disabled
          className='w-full cursor-not-allowed justify-between gap-2 px-3 py-2 text-left opacity-50'
        >
          <div className='flex items-center gap-2'>
            <Settings className='h-4 w-4' /> Appearance
          </div>
          <span className='bg-muted-foreground/20 text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-medium'>
            Soon
          </span>
        </TabsTrigger>
        <TabsTrigger
          value='security'
          disabled
          className='w-full cursor-not-allowed justify-between gap-2 px-3 py-2 text-left opacity-50'
        >
          <div className='flex items-center gap-2'>
            <Shield className='h-4 w-4' /> Security
          </div>
          <span className='bg-muted-foreground/20 text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-medium'>
            Soon
          </span>
        </TabsTrigger>
      </TabsList>
    </aside>
  )
}

export default SettingsSidebar
