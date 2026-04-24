'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { useConversationStore } from '@/lib/conversation-store'
import ConversationListItem from './conversation-list-item'
import { NowProvider } from '@/hooks/useNow'

const ConversationList = () => {
  const conversations = useConversationStore((s) => s.conversations)

  return (
    <div className='bg-background/95 supports-backdrop-filter:bg-background/60 flex h-full flex-col backdrop-blur'>
      <div className='p-4 pb-2'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-2xl font-bold tracking-tight'>Messages</h2>
        </div>
      </div>
      <ScrollArea className='flex-1'>
        <NowProvider>
          <div className='flex flex-col gap-1 p-2'>
            {conversations.length === 0 ? (
              <div className='flex h-40 items-center justify-center'>
                <p className='text-muted-foreground text-sm'>No conversations yet.</p>
              </div>
            ) : (
              conversations.map((conv) => <ConversationListItem key={conv.id} conversation={conv} />)
            )}
          </div>
        </NowProvider>
      </ScrollArea>
    </div>
  )
}

export default ConversationList
