import { streamText } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

type PatientContext = {
  name: string
  aiSummary: string | null
  flags: string[]
  intakeData: Record<string, string>
}

type UIMessagePart = { type: string; text?: string }
type UIMessage = { role: string; parts?: UIMessagePart[]; content?: string }

function extractText(msg: UIMessage): string {
  if (msg.parts) {
    return msg.parts
      .filter((p) => p.type === 'text')
      .map((p) => p.text ?? '')
      .join('')
  }
  return msg.content ?? ''
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  const session = await auth()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const { patientId } = await params

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
  const patientRes = await fetch(`${apiUrl}/patients/${patientId}`, { cache: 'no-store' })

  if (!patientRes.ok) return new Response('Patient not found', { status: 404 })

  const patient = (await patientRes.json()) as PatientContext

  const { messages } = (await request.json()) as { messages: UIMessage[] }

  const modelMessages = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: extractText(m),
    }))
    .filter((m) => m.content.length > 0)

  const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: `You are a clinical assistant helping a doctor review a patient's profile.
Patient: ${patient.name}
Clinical Summary: ${patient.aiSummary ?? 'Not available'}
Clinical Flags: ${patient.flags.length > 0 ? patient.flags.join(', ') : 'None'}
Chief Complaint: ${patient.intakeData.chiefComplaint ?? 'Not specified'}
Current Medications: ${patient.intakeData.currentMedications ?? 'Not specified'}
Allergies: ${patient.intakeData.allergies ?? 'Not specified'}

Answer the doctor's questions clearly and concisely based only on this patient context.
Do not invent clinical information. If something is unknown, say so.`,
    messages: modelMessages,
    maxOutputTokens: 512,
    temperature: 0.2,
  })

  return result.toUIMessageStreamResponse()
}
