import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { followUpQueue } from '../workers/followUpWorker'

export async function consultationsRoutes(fastify: FastifyInstance) {
  // POST /consultations — create a new consultation
  fastify.post<{
    Body: { patientId: string; scheduledAt: string; notes?: string }
  }>('/', async (request, reply) => {
    const { patientId, scheduledAt, notes } = request.body
    const consultation = await prisma.consultation.create({
      data: {
        patientId,
        scheduledAt: new Date(scheduledAt),
        notes,
      },
    })
    return reply.status(201).send(consultation)
  })

  // POST /consultations/:id/complete — mark consultation as done + enqueue follow-up
  fastify.post<{
    Params: { id: string }
    Body: { notes?: string }
  }>('/:id/complete', async (request, reply) => {
    const consultation = await prisma.consultation.findUnique({
      where: { id: request.params.id },
    })
    if (!consultation) return reply.status(404).send({ error: 'Not found' })

    const updated = await prisma.consultation.update({
      where: { id: request.params.id },
      data: {
        status: 'completed',
        completedAt: new Date(),
        notes: request.body?.notes ?? consultation.notes,
      },
    })

    // Enqueue follow-up job — delay=0 for demo (set 24h for production)
    await followUpQueue.add(
      'send-followup',
      { patientId: updated.patientId, consultationId: updated.id },
      { delay: 0 }
    )

    return updated
  })
}
