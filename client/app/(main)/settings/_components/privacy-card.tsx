'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

interface PrivacyCardProps {
  isPublic: boolean | undefined
  onToggle: () => void
}

const PrivacyCard = ({ isPublic, onToggle }: PrivacyCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col items-start gap-2'>
          <div className='flex w-full items-center justify-between'>
            <div className='flex flex-col'>
              <p className='text-muted-foreground font-semibold'>Private account</p>
              <p className='text-muted-foreground text-xs'>
                Private accounts are only visible to you and your followers.
              </p>
            </div>
            <Switch checked={!isPublic} onCheckedChange={onToggle} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PrivacyCard
