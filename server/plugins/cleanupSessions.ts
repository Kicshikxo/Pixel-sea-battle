import { prisma } from '~~/prisma/client'

export const CLEANUP_INTERVAL = 1 * 60 * 1000

export default defineNitroPlugin((nitroApp) => {
  const cleanup = async () => {
    try {
      const result = await prisma.userSession.deleteMany({
        where: {
          expiredAt: { lt: new Date() },
        },
      })

      if (result.count) {
        console.info(`[Session Cleanup] Removed ${result.count} expired sessions`)
      }
    } catch (error) {
      console.error(`[Session Cleanup] Error removing expired sessions: ${error}`)
    }
  }

  const cleanupInterval = setInterval(cleanup, CLEANUP_INTERVAL)
  cleanup()

  nitroApp.hooks.hook('close', () => {
    if (cleanupInterval) {
      clearInterval(cleanupInterval)
    }
  })
})
