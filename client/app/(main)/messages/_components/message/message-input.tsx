'use client'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import { useStomp } from '@/providers/StompProvider'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { Paperclip, Send, Smile } from 'lucide-react'
import { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

const MessageInput = ({
  selectedConversationId,
  disabled = false
}: {
  selectedConversationId: string | null
  disabled?: boolean
}) => {
  const [message, setMessage] = useState('')
  const { connected, send } = useStomp()
  const { token } = useAuth()

  const handleSendMessage = async () => {
    if (!connected || !token) return
    const content = message.trim()
    if (!content) return
    if (!selectedConversationId) return
    send('/app/chat.sendMessage', {
      conversationId: selectedConversationId,
      content
    })
    setMessage('')
  }

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji)
  }

  return (
    <div className='relative'>
      <div className='bg-muted/30 focus-within:bg-background focus-within:ring-ring/50 flex items-end gap-2 rounded-3xl border p-1.5 shadow-sm transition-all focus-within:shadow-md focus-within:ring-1'>
        {/* Attachment Button */}
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='text-muted-foreground hover:bg-muted hover:text-foreground h-9 w-9 shrink-0 rounded-full'
        >
          <Paperclip className='h-5 w-5' />
        </Button>

        {/* Input Field */}
        <TextareaAutosize
          disabled={!connected || disabled}
          minRows={1}
          maxRows={4}
          placeholder='Message...'
          className={cn(
            'placeholder:text-muted-foreground/70 max-h-32 min-h-[40px] flex-1 resize-none bg-transparent py-2.5 text-sm outline-none'
          )}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
        />

        {/* Emoji Button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='text-muted-foreground hover:bg-muted hover:text-foreground mb-0.5 h-9 w-9 shrink-0 rounded-full'
            >
              <Smile className='h-5 w-5' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-full border-none bg-transparent p-0 shadow-none' side='top' align='end'>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </PopoverContent>
        </Popover>

        {/* Send Button */}
        <Button
          type='button'
          size='icon'
          className={cn(
            'mb-0.5 h-9 w-9 shrink-0 rounded-full transition-all duration-200',
            message.trim()
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
          onClick={handleSendMessage}
          disabled={!connected || !message.trim() || disabled}
        >
          <Send className='ml-0.5 h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}

export default MessageInput
