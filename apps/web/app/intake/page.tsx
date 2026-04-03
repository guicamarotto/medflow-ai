'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { intakeFormSchema, type IntakeFormInput } from '@medflow/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Stethoscope, Loader2, CheckCircle } from 'lucide-react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function IntakePage() {
  const router = useRouter()
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IntakeFormInput>({
    resolver: zodResolver(intakeFormSchema),
  })

  async function onSubmit(data: IntakeFormInput) {
    setState('submitting')
    setErrorMsg(null)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
      const res = await fetch(`${apiUrl}/intake/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.status === 409) {
        setErrorMsg('A patient with this email already exists.')
        setState('error')
        return
      }
      if (!res.ok) {
        setErrorMsg('Something went wrong. Please try again.')
        setState('error')
        return
      }

      setState('success')
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch {
      setErrorMsg('Could not reach the server. Make sure the API is running.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-3">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
          <p className="font-semibold text-lg">Intake submitted successfully</p>
          <p className="text-sm text-muted-foreground">AI analysis complete. Redirecting to dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold text-sm">MedFlow AI</p>
            <p className="text-xs text-muted-foreground">Patient Intake Form</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Patient Intake</CardTitle>
            <CardDescription>
              Fill out the form below. Our AI will analyze your information and generate a clinical
              summary for the care team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name + Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" error={errors.name?.message}>
                  <Input {...register('name')} placeholder="Jane Smith" />
                </Field>
                <Field label="Email" error={errors.email?.message}>
                  <Input {...register('email')} type="email" placeholder="jane@example.com" />
                </Field>
              </div>

              {/* Chief Complaint */}
              <Field
                label="Chief Complaint"
                hint="Describe your main health concern"
                error={errors.chiefComplaint?.message}
              >
                <Textarea
                  {...register('chiefComplaint')}
                  rows={3}
                  placeholder="e.g. I've been struggling with weight gain since starting my new medication…"
                />
              </Field>

              {/* Weight History */}
              <Field
                label="Weight History"
                hint="Current weight, height, and any significant changes"
                error={errors.weightHistory?.message}
              >
                <Textarea
                  {...register('weightHistory')}
                  rows={2}
                  placeholder="e.g. Current: 185 lbs, Height: 5ft 8in. Gained 20 lbs over the past year."
                />
              </Field>

              {/* Medications + Allergies */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Current Medications"
                  hint='Enter "None" if not applicable'
                  error={errors.currentMedications?.message}
                >
                  <Textarea
                    {...register('currentMedications')}
                    rows={2}
                    placeholder="e.g. Metformin 1000mg, Lisinopril 10mg"
                  />
                </Field>
                <Field
                  label="Known Allergies"
                  hint='Enter "None" if not applicable'
                  error={errors.allergies?.message}
                >
                  <Textarea
                    {...register('allergies')}
                    rows={2}
                    placeholder="e.g. Penicillin, Sulfa drugs"
                  />
                </Field>
              </div>

              {/* Additional Notes */}
              <Field label="Additional Notes" hint="Optional — anything else you'd like us to know">
                <Textarea
                  {...register('additionalNotes')}
                  rows={2}
                  placeholder="e.g. Recent lab results, family history, lifestyle factors…"
                />
              </Field>

              {errorMsg && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                  {errorMsg}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={state === 'submitting'}>
                {state === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing with AI…
                  </>
                ) : (
                  'Submit Intake Form'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          PoC only — not for clinical use. No real patient data is processed.
        </p>
      </div>
    </div>
  )
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
