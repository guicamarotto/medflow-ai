import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { FastifyAdapter } from '@bull-board/fastify'
import type { FastifyInstance } from 'fastify'
import { followUpQueue } from '../workers/followUpWorker'

export async function registerBullBoard(fastify: FastifyInstance) {
  const serverAdapter = new FastifyAdapter()
  serverAdapter.setBasePath('/admin/queues')

  createBullBoard({
    queues: [new BullMQAdapter(followUpQueue)],
    serverAdapter,
  })

  await fastify.register(serverAdapter.registerPlugin(), { prefix: '/admin/queues' })
  console.log('[BullBoard] UI available at http://localhost:3001/admin/queues')
}
