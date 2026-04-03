import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function patientsRoutes(fastify: FastifyInstance) {
  // GET /patients — list all patients, sorted by urgency
  fastify.get('/', async (request, reply) => {
    const query = request.query as { sortBy?: string }
    const patients = await prisma.patient.findMany({
      orderBy:
        query.sortBy === 'urgency'
          ? [{ urgencyScore: 'desc' }, { createdAt: 'desc' }]
          : [{ createdAt: 'desc' }],
    })
    return patients
  })

  // GET /patients/:id
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const patient = await prisma.patient.findUnique({
      where: { id: request.params.id },
      include: {
        consultations: { orderBy: { scheduledAt: 'desc' } },
        followUps: { orderBy: { createdAt: 'desc' } },
      },
    })
    if (!patient) return reply.status(404).send({ error: 'Not found' })
    return patient
  })

  // GET /patients/:id/followups
  fastify.get<{ Params: { id: string } }>('/:id/followups', async (request, reply) => {
    const followUps = await prisma.followUp.findMany({
      where: { patientId: request.params.id },
      orderBy: { createdAt: 'desc' },
    })
    return followUps
  })
}
