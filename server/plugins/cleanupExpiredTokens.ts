import { prisma } from '~~/prisma/client'

export default defineNitroPlugin((nitroApp) => {
  const CLEANUP_INTERVAL = 10 * 60 * 1000

  const cleanupExpiredTokens = async () => {
    try {
      const result = await prisma.userRefreshToken.deleteMany({
        where: {
          expiredAt: { lt: new Date() },
        },
      })

      if (result.count) {
        console.info(`[Token Cleanup] Removed ${result.count} expired refresh tokens`)
      }
    } catch (error) {
      console.error(`[Token Cleanup] Error removing expired refresh tokens: ${error}`)
    }
  }

  const cleanupInterval = setInterval(cleanupExpiredTokens, CLEANUP_INTERVAL)
  cleanupExpiredTokens()

  nitroApp.hooks.hook('close', () => {
    if (cleanupInterval) {
      clearInterval(cleanupInterval)
    }
  })
})
