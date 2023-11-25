import type { Room, RoomMessage } from '@prisma/client'
import { Socket } from 'socket.io'
import { prisma } from '~/prisma/client'

declare module '~/socket.io/types' {
  interface ClientToServerEvents {
    'room:connect': (data: { id: string }, callback: (response: { room: Room | null; messages: RoomMessage[] }) => void) => void
  }
}

export default {
  event: 'room:connect',
  handler: async (socket, data, callback) => {
    const room = await prisma.room.findUnique({ where: { id: data.id }, include: { messages: true } })

    if (!room) return

    socket.join(room.id)
    callback({ room, messages: room.messages })
  },
} as { event: string; handler: (socket: Socket, data: { id: string }, callback: (response?: { room: Room | null; messages: RoomMessage[] }) => void) => void }
