import type { FollowUp } from '@medflow/shared'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail } from 'lucide-react'

interface FollowUpListProps {
  followUps: FollowUp[]
}

export function FollowUpList({ followUps }: FollowUpListProps) {
  if (followUps.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-1.5">
          <Mail className="w-4 h-4" /> AI Follow-ups
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {followUps.map((fu) => (
          <div key={fu.id} className="text-xs space-y-1 border-l-2 border-primary/30 pl-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {new Date(fu.createdAt).toLocaleDateString()}
              </span>
              <Badge
                variant={
                  fu.status === 'sent' ? 'success' : fu.status === 'failed' ? 'danger' : 'secondary'
                }
              >
                {fu.status}
              </Badge>
            </div>
            <p className="text-sm leading-relaxed">{fu.message}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
