import { Queue, Worker } from 'bullmq'
import { redisConnection } from '../lib/redis'
import { prisma } from '../lib/prisma'
import { createAIProvider } from '../lib/ai/provider'

export interface FollowUpJobData {
  patientId: string
  consultationId: string
}

export const followUpQueue = new Queue<FollowUpJobData>('follow-up', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
})

const SYSTEM_PROMPT = `You are an empathetic health assistant for a weight management telehealth platform.
Generate a personalized, warm follow-up message for the patient based on their clinical history and consultation notes.
Keep the message concise (3-4 sentences), actionable, and encouraging.
Do not use overly medical language. Do not make diagnostic claims.`

export function startFollowUpWorker() {
  const worker = new Worker<FollowUpJobData>(
    'follow-up',
    async (job) => {
      const { patientId, consultationId } = job.data
      console.log(`[FollowUpWorker] Processing job ${job.id} for patient ${patientId}`)

      const [patient, consultation] = await Promise.all([
        prisma.patient.findUniqueOrThrow({ where: { id: patientId } }),
        prisma.consultation.findUniqueOrThrow({ where: { id: consultationId } }),
      ])

      const aiProvider = createAIProvider()
      const message = await aiProvider.complete(
        JSON.stringify({
          patientName: patient.name,
          summary: patient.aiSummary,
          flags: patient.flags,
          consultationNotes: consultation.notes,
        }),
        SYSTEM_PROMPT
      )

      await prisma.followUp.create({
        data: {
          patientId,
          message,
          channel: 'email',
          status: 'sent',
          sentAt: new Date(),
        },
      })

      console.log(`[FollowUpWorker] Follow-up created for patient ${patient.name}`)
    },
    {
      connection: redisConnection,
      concurrency: 5,
    }
  )

  worker.on('completed', (job) => {
    console.log(`[FollowUpWorker] Job ${job.id} completed`)
  })

  worker.on('failed', (job, err) => {
    console.error(`[FollowUpWorker] Job ${job?.id} failed:`, err.message)
  })

  console.log('[FollowUpWorker] Started')
  return worker
}
