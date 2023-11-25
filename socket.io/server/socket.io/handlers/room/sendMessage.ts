import type { RoomMessage } from '@prisma/client'
import { Socket } from 'socket.io'
import { prisma } from '~/prisma/client'
import { io } from '~/socket.io'

declare module '~/socket.io/types' {
  interface ClientToServerEvents {
    'room:sendMessage': (data: { roomId: string; text: string }) => void
  }
  interface ServerToClientEvents {
    'room:addMessage': (message: RoomMessage) => void
  }
}

export default {
  event: 'room:sendMessage',
  handler: async (socket, data) => {
    if (!socket.user) return

    const message = await prisma.roomMessage.create({ data: { roomId: data.roomId, userId: socket.user?.id, text: data.text } })

    io.server.to(data.roomId).emit('room:addMessage', message)
  },
} as { event: string; handler: (socket: Socket, data: { roomId: string; text: string }) => void }
