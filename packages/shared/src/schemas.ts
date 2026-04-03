import { z } from 'zod'

export const intakeFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  chiefComplaint: z.string().min(10, 'Please describe your main concern (min 10 characters)'),
  weightHistory: z.string().min(5, 'Please provide weight history'),
  currentMedications: z.string().min(1, 'Enter "None" if not applicable'),
  allergies: z.string().min(1, 'Enter "None" if not applicable'),
  additionalNotes: z.string().optional(),
})

export const intakeAnalysisSchema = z.object({
  summary: z.string(),
  urgency_score: z.number().int().min(1).max(5),
  suggested_questions: z.array(z.string()),
  flags: z.array(z.string()),
})

export type IntakeFormInput = z.infer<typeof intakeFormSchema>
export type IntakeAnalysisOutput = z.infer<typeof intakeAnalysisSchema>
