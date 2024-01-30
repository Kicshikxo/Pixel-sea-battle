import { Socket } from 'socket.io'
import { prisma } from '~/prisma/client'

declare module '~/socket.io/types' {
  interface ClientToServerEvents {
    'room:leave': (data: { id: string }, callback?: () => void) => void
  }
}

export default {
  event: 'room:leave',
  handler: async (socket, data, callback) => {
    const room = await prisma.room.findUnique({ where: { id: data.id }, include: { messages: true } })

    if (!room) return

    socket.leave(room.id)

    callback?.()
  },
} as { event: string; handler: (socket: Socket, data: { id: string }, callback?: () => void) => void }
