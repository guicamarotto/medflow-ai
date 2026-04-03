import { Redis } from 'ioredis'

const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379'

export const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // Required by BullMQ
})

redisConnection.on('error', (err) => {
  console.error('[Redis] Connection error:', err.message)
})

redisConnection.on('connect', () => {
  console.log('[Redis] Connected')
})
