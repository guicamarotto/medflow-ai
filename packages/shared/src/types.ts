export type UrgencyLevel = 1 | 2 | 3 | 4 | 5

export interface IntakeForm {
  name: string
  email: string
  chiefComplaint: string
  weightHistory: string
  currentMedications: string
  allergies: string
  additionalNotes?: string
}

export interface IntakeAnalysis {
  summary: string
  urgency_score: UrgencyLevel
  suggested_questions: string[]
  flags: string[]
}

export interface Patient {
  id: string
  name: string
  email: string
  intakeData: IntakeForm
  aiSummary: string | null
  urgencyScore: number | null
  flags: string[]
  createdAt: string
}

export interface Consultation {
  id: string
  patientId: string
  notes: string | null
  status: 'scheduled' | 'completed' | 'cancelled'
  scheduledAt: string
  completedAt: string | null
  createdAt: string
}

export interface FollowUp {
  id: string
  patientId: string
  message: string
  channel: 'email' | 'sms'
  status: 'pending' | 'sent' | 'failed'
  sentAt: string | null
  createdAt: string
}

export interface ApiError {
  error: string
  message: string
}
