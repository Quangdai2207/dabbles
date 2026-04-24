'use client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useClient } from '@/hooks/useClient'
import { useAuth } from '@/providers/AuthProvider'
import logoutService from '@/services/auth/logout'
import { LogOut, Menu, Settings, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function UserMenuButton() {
  const { token, authData } = useAuth()
  const router = useRouter()
  const isClient = useClient()

  if (!isClient) return null
  const handleLogout = async () => {
    if (!token) return
    await logoutService(token)
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size={'icon'}>
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start'>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              router.push(`/library/${authData?.username}`)
            }}
          >
            <User className='mr-2 h-4 w-4' />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            <Settings className='mr-2 h-4 w-4' />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className='mr-2 h-4 w-4' />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
