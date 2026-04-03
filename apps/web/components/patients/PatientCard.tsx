import Link from 'next/link'
import type { Patient } from '@medflow/shared'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UrgencyBadge } from './UrgencyBadge'
import { Clock } from 'lucide-react'

interface PatientCardProps {
  patient: Patient
}

export function PatientCard({ patient }: PatientCardProps) {
  return (
    <Link href={`/patients/${patient.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-sm">{patient.name}</p>
              <p className="text-xs text-muted-foreground">{patient.email}</p>
            </div>
            <UrgencyBadge score={patient.urgencyScore} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {patient.aiSummary && (
            <p className="text-xs text-muted-foreground line-clamp-2">{patient.aiSummary}</p>
          )}
          {patient.flags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {patient.flags.slice(0, 3).map((flag) => (
                <span
                  key={flag}
                  className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground"
                >
                  {flag}
                </span>
              ))}
              {patient.flags.length > 3 && (
                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                  +{patient.flags.length - 3} more
                </span>
              )}
            </div>
          )}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            {new Date(patient.createdAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
