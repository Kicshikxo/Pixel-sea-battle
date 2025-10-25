import { prisma } from '~~/prisma/client'
import type { SocketMiddleware } from '~~/types/socket.io'

export default {
  name: 'auth',
  handler: async (socket, next) => {
    try {
      const sessionCookie = Object.fromEntries(
        (socket.request.headers.cookie ?? '')
          .split(';')
          .map((cookie) => cookie.split('=').map((part) => decodeURIComponent(part.trim()))),
      )[useRuntimeConfig().public.auth.sessionKey]
      const session = await prisma.userSession.findUnique({ where: { id: sessionCookie } })
      const user = await prisma.user.findUnique({ where: { id: session?.userId } })

      socket.user = user
    } catch {
      socket.user = null
    } finally {
      next()
    }
  },
} as SocketMiddleware
