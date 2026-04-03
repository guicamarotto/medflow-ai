import { Badge } from '@/components/ui/badge'

const urgencyConfig = {
  1: { label: 'Low', variant: 'success' as const },
  2: { label: 'Low-Mod', variant: 'success' as const },
  3: { label: 'Moderate', variant: 'warning' as const },
  4: { label: 'High', variant: 'danger' as const },
  5: { label: 'Critical', variant: 'danger' as const },
}

interface UrgencyBadgeProps {
  score: number | null
}

export function UrgencyBadge({ score }: UrgencyBadgeProps) {
  if (!score) return <Badge variant="outline">Pending</Badge>
  const config = urgencyConfig[score as keyof typeof urgencyConfig] ?? urgencyConfig[3]
  return (
    <Badge variant={config.variant}>
      {score} — {config.label}
    </Badge>
  )
}
