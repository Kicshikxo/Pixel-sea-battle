import type { User } from '@prisma/client'
import { Socket } from 'socket.io'
import { authMiddleware } from '~/socket.io/server/socket.io/middleware'

declare module '~/socket.io/types' {
  interface ClientToServerEvents {
    initSocket: (data: Object, callback: (response?: User | null) => void) => void
  }
}

export default {
  event: 'initSocket',
  handler: async (socket, data, callback) => {
    authMiddleware.handler(socket)

    callback(socket.user)
  },
} as { event: string; handler: (socket: Socket, data: Object, callback: (response?: User | null) => void) => void }
