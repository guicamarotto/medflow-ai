import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { UrgencyBadge } from '@/components/patients/UrgencyBadge'
import { AIStreamChat } from '@/components/patients/AIStreamChat'
import { FollowUpList } from '@/components/patients/FollowUpList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, ClipboardList, Mail } from 'lucide-react'
import type { Patient, Consultation, FollowUp } from '@medflow/shared'

interface PatientDetailPageProps {
  params: Promise<{ id: string }>
}

type PatientWithRelations = Patient & {
  consultations: Consultation[]
  followUps: FollowUp[]
}

async function getPatient(id: string): Promise<PatientWithRelations | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
    const res = await fetch(`${apiUrl}/patients/${id}`, { cache: 'no-store' })
    if (res.status === 404) return null
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params
  const patient = await getPatient(id)
  if (!patient) notFound()

  const intakeData = patient.intakeData as unknown as Record<string, string>

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={patient.name} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-3">

            {/* Left column — patient info */}
            <div className="lg:col-span-1 space-y-4">
              {/* Summary card */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{patient.name}</CardTitle>
                    <UrgencyBadge score={patient.urgencyScore} />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    {patient.email}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {patient.aiSummary && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                        AI Clinical Summary
                      </p>
                      <p className="text-sm leading-relaxed">{patient.aiSummary}</p>
                    </div>
                  )}

                  {patient.flags.length > 0 && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                        Clinical Flags
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {patient.flags.map((flag) => (
                          <Badge key={flag} variant="outline" className="text-xs">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Intake data */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4" /> Intake Form
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <IntakeField label="Chief Complaint" value={intakeData.chiefComplaint} />
                  <IntakeField label="Weight History" value={intakeData.weightHistory} />
                  <IntakeField label="Medications" value={intakeData.currentMedications} />
                  <IntakeField label="Allergies" value={intakeData.allergies} />
                  {intakeData.additionalNotes && (
                    <IntakeField label="Additional Notes" value={intakeData.additionalNotes} />
                  )}
                </CardContent>
              </Card>

              {/* Consultations */}
              {patient.consultations.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4" /> Consultations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {patient.consultations.map((c) => (
                      <div key={c.id} className="text-xs space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            {new Date(c.scheduledAt).toLocaleDateString()}
                          </span>
                          <Badge
                            variant={
                              c.status === 'completed'
                                ? 'success'
                                : c.status === 'cancelled'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                          >
                            {c.status}
                          </Badge>
                        </div>
                        {c.notes && (
                          <p className="text-muted-foreground line-clamp-2">{c.notes}</p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Follow-ups */}
              <FollowUpList followUps={patient.followUps} />
            </div>

            {/* Right column — streaming chat */}
            <div className="lg:col-span-2">
              <AIStreamChat patientId={patient.id} patientName={patient.name} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function IntakeField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm mt-0.5">{value}</p>
    </div>
  )
}
