import type { Patient } from '@medflow/shared'
import { PatientCard } from './PatientCard'
import { Users } from 'lucide-react'

interface PatientQueueProps {
  patients: Patient[]
}

export function PatientQueue({ patients }: PatientQueueProps) {
  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Users className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm">No patients in queue</p>
      </div>
    )
  }

  const criticalPatients = patients.filter((p) => (p.urgencyScore ?? 0) >= 4)
  const otherPatients = patients.filter((p) => (p.urgencyScore ?? 0) < 4)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {patients.length} patient{patients.length !== 1 ? 's' : ''} in queue
          {criticalPatients.length > 0 && (
            <span className="ml-2 text-red-600 font-medium">
              · {criticalPatients.length} require immediate attention
            </span>
          )}
        </p>
      </div>

      {criticalPatients.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-3">
            High Priority
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {criticalPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        </section>
      )}

      {otherPatients.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Standard Queue
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {otherPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
