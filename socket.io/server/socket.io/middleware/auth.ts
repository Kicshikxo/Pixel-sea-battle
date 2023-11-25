import type { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { Socket } from 'socket.io'
import type { AuthTokenData } from '~/auth/types'
import { prisma } from '~/prisma/client'

declare module 'socket.io' {
  interface Socket {
    user?: User | null
  }
}

export default {
  name: 'auth',
  handler: async (socket, next) => {
    try {
      const token = Object.fromEntries((socket.request.headers.cookie ?? '').split(';').map((cookie) => cookie.split('=').map((part) => decodeURIComponent(part.trim()))))[useRuntimeConfig().auth.cookieName]
      const data = jwt.verify(token, useRuntimeConfig().auth.jwtSecretKey) as AuthTokenData
      const user = await prisma.user.findUnique({ where: { id: data.id } })

      socket.user = user
    } catch (e) {
      socket.user = null
    }

    if (next) next()
  },
} as { name: string; handler: (socket: Socket, next?: () => void) => void }
