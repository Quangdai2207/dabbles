'use client'

import { Tabs, TabsContent } from '@/components/ui/tabs'
import SettingsSidebar from './_components/settings-sidebar'
import AccountSettings from './_components/account-settings'

const SettingsPage = () => {
  return (
    <div className='container mx-auto px-4 py-10 md:px-8'>
      <div className='mb-8 flex flex-col gap-2'>
        <h1 className='text-3xl font-bold'>Settings</h1>
        <p className='text-muted-foreground'>Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue='account' className='flex flex-col gap-8 lg:flex-row' orientation='vertical'>
        <SettingsSidebar />

        <div className='flex-1 lg:max-w-2xl'>
          <TabsContent value='account' className='mt-0 space-y-6'>
            <AccountSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default SettingsPage
