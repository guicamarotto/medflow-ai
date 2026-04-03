import { initSentry } from './lib/sentry'
initSentry()

import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import { patientsRoutes } from './routes/patients'
import { consultationsRoutes } from './routes/consultations'
import { intakeRoutes } from './routes/intake'
import { registerBullBoard } from './lib/bullboard'
import { startFollowUpWorker } from './workers/followUpWorker'

const server = Fastify({ logger: true })

async function bootstrap() {
  await server.register(cors, {
    origin: process.env.WEB_URL ?? 'http://localhost:3000',
    credentials: true,
  })

  await server.register(rateLimit, {
    global: false,
    max: 20,
    timeWindow: '1 minute',
  })

  // Routes
  await server.register(patientsRoutes, { prefix: '/patients' })
  await server.register(consultationsRoutes, { prefix: '/consultations' })
  await server.register(intakeRoutes, { prefix: '/intake' })

  // Bull Board UI at /admin/queues
  await registerBullBoard(server)

  // Start BullMQ worker
  startFollowUpWorker()

  const port = Number(process.env.API_PORT ?? 3001)
  await server.listen({ port, host: '0.0.0.0' })
  console.log(`API running on http://localhost:${port}`)
}

bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})
