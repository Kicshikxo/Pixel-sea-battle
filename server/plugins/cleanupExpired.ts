import { prisma } from '~~/prisma/client'

export const CLEANUP_INTERVAL = 1 * 60 * 1000

const cleanupTasks: { label: string; handler: () => Promise<number> }[] = [
  {
    label: 'sessions',
    handler: async () => {
      return (
        await prisma.userSession.deleteMany({
          where: { expiresAt: { lt: new Date() } },
        })
      ).count
    },
  },
  {
    label: 'email confirmations',
    handler: async () => {
      return (
        await prisma.emailConfirmation.deleteMany({
          where: { expiresAt: { lt: new Date() } },
        })
      ).count
    },
  },
  {
    label: 'password recoveries',
    handler: async () => {
      return (
        await prisma.passwordRecovery.deleteMany({
          where: { expiresAt: { lt: new Date() } },
        })
      ).count
    },
  },
]

export default defineNitroPlugin((nitroApp) => {
  let cleanupTimeout: NodeJS.Timeout | null = null

  const cleanup = async () => {
    for (const task of cleanupTasks) {
      try {
        const removed = await task.handler()
        if (removed) console.info(`[Cleanup] Removed ${removed} expired ${task.label}`)
      } catch (error) {
        console.error(`[Cleanup] Error removing ${task.label}:`, error)
      }
    }

    cleanupTimeout = setTimeout(cleanup, CLEANUP_INTERVAL)
  }

  cleanup()
  cleanupTimeout = setTimeout(cleanup, CLEANUP_INTERVAL)

  nitroApp.hooks.hook('close', () => {
    if (cleanupTimeout) {
      clearTimeout(cleanupTimeout)
    }
  })
})
