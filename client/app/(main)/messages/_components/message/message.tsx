'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toHHMM } from '@/lib/time-convert'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import { memo, useMemo } from 'react'
import Avatar from './avatar-message'

type MessagePosition = 'first' | 'middle' | 'last' | 'single'

interface MessageProps {
  message: TMessageConversation
  showTime?: boolean
  showAvatar?: boolean
  positionInBlock?: MessagePosition
}

const Message = ({ message, showAvatar = true, positionInBlock = 'single' }: MessageProps) => {
  const { authData } = useAuth()
  const isAuthUser = message.sender.id === authData?.id

  const positionClasses = useMemo(
    () => ({
      single: 'rounded-2xl',
      first: isAuthUser ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm',
      middle: isAuthUser ? 'rounded-2xl rounded-tr-sm rounded-br-sm' : 'rounded-2xl rounded-tl-sm rounded-bl-sm',
      last: isAuthUser ? 'rounded-2xl rounded-br-sm' : 'rounded-2xl rounded-bl-sm'
    }),
    [isAuthUser]
  )

  return (
    <div className={cn('mb-1 flex items-end gap-2', isAuthUser && 'flex-row-reverse')}>
      {/* Avatar (Invisible placeholder if not shown to keep spacing, or just conditionally render) */}
      <div className={cn('flex h-8 w-8 shrink-0 items-end', !showAvatar && 'invisible')}>
        <div className='border-border/50 relative h-8 w-8 overflow-hidden rounded-full border shadow-sm'>
          {message.sender.avatar ? (
            <Avatar avatar={message.sender.avatar} name={message.sender.name} />
          ) : (
            <div className='bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-[10px]'>
              {message.sender.name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      <div className={cn('flex max-w-[70%] flex-col lg:max-w-[60%]', isAuthUser ? 'items-end' : 'items-start')}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'group relative px-4 py-2 text-sm wrap-break-word shadow-sm',
                isAuthUser
                  ? 'bg-primary text-primary-foreground from-primary to-primary/90 bg-linear-to-br'
                  : 'bg-secondary/80 text-secondary-foreground hover:bg-secondary',
                positionClasses[positionInBlock],
                // Add a subtle border for non-auth user messages for better contrast in light mode
                !isAuthUser && 'border-border/10 border'
              )}
            >
              <p className='leading-relaxed whitespace-pre-wrap'>{message.content}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent className='bg-foreground text-background text-xs' side={isAuthUser ? 'left' : 'right'}>
            {toHHMM(message.createdDate)}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

export default memo(Message)
