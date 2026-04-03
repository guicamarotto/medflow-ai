import { z } from 'zod'
import { createAIProvider } from '../lib/ai/provider'
import type { IntakeForm } from '@medflow/shared'

const intakeAnalysisSchema = z.object({
  summary: z.string(),
  urgency_score: z.number().int().min(1).max(5),
  suggested_questions: z.array(z.string()),
  flags: z.array(z.string()),
})

export type IntakeAnalysis = z.infer<typeof intakeAnalysisSchema>

const SYSTEM_PROMPT = `You are a clinical assistant for a weight management telehealth platform.
Analyze the patient intake form and return ONLY a valid JSON object — no markdown, no commentary.
JSON structure:
{
  "summary": "2-3 sentence clinical summary",
  "urgency_score": <integer 1-5, where 5 = most urgent>,
  "suggested_questions": ["follow-up question 1", "follow-up question 2", "follow-up question 3"],
  "flags": ["clinical flag 1", "clinical flag 2"]
}
Urgency scoring: 1=preventive/lifestyle, 2=low risk, 3=moderate risk, 4=high risk with comorbidities, 5=critical/pre-surgical/severe comorbidities.`

const FALLBACK_ANALYSIS: IntakeAnalysis = {
  summary: 'AI analysis is currently unavailable. Please review intake form manually.',
  urgency_score: 3,
  suggested_questions: ['Could you describe your main health concern in more detail?'],
  flags: ['Manual review required'],
}

export async function analyzeIntake(intakeData: IntakeForm): Promise<IntakeAnalysis> {
  try {
    const aiProvider = createAIProvider()
    const raw = await aiProvider.complete(JSON.stringify(intakeData), SYSTEM_PROMPT)

    // Strip markdown code fences if present
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()

    const parsed = intakeAnalysisSchema.safeParse(JSON.parse(cleaned))
    if (!parsed.success) {
      console.error('[IntakeAnalyzer] Schema validation failed:', parsed.error.message)
      return FALLBACK_ANALYSIS
    }
    return parsed.data
  } catch (err) {
    console.error('[IntakeAnalyzer] Error:', err)
    return FALLBACK_ANALYSIS
  }
}
