import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { analyzeIntake } from '../services/intakeAnalyzer'
import type { IntakeForm } from '@medflow/shared'

export async function intakeRoutes(fastify: FastifyInstance) {
  // POST /intake/analyze — submit intake form, get AI analysis, store patient
  fastify.post<{ Body: IntakeForm }>(
    '/analyze',
    {
      config: { rateLimit: { max: 5, timeWindow: '1 minute' } },
    },
    async (request, reply) => {
      const intakeData = request.body

      // Check for duplicate email
      const existing = await prisma.patient.findUnique({ where: { email: intakeData.email } })
      if (existing) {
        return reply.status(409).send({
          error: 'Conflict',
          message: 'A patient with this email already exists',
        })
      }

      // Run AI analysis
      const analysis = await analyzeIntake(intakeData)

      // Persist patient
      const patient = await prisma.patient.create({
        data: {
          name: intakeData.name,
          email: intakeData.email,
          intakeData: intakeData as unknown as object,
          aiSummary: analysis.summary,
          urgencyScore: analysis.urgency_score,
          flags: analysis.flags,
        },
      })

      return reply.status(201).send({ patient, analysis })
    }
  )
}
