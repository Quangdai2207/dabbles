'use client'

import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import PrivacyCard from './privacy-card'
import ProfileCard from './profile-card'
import PasswordCard from './password-card'
import BlockedUsersCard from './blocked-users-card'
import SettingsCategory from './settings-category'

const AccountSettings = () => {
  const { authData, token, updateProfile, setPrivateAccount } = useAuth()
  const router = useRouter()

  const toggleAccountPrivacy = async () => {
    if (!token || !authData) return
    await setPrivateAccount(token)
    router.refresh()
  }

  return (
    <div className='space-y-8'>
      <PrivacyCard isPublic={authData?.public} onToggle={toggleAccountPrivacy} />
      <ProfileCard authData={authData} token={token} updateProfile={updateProfile} />
      <PasswordCard token={token} />
      <SettingsCategory />
      <BlockedUsersCard token={token} />
    </div>
  )
}

export default AccountSettings
