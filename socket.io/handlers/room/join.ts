import type { Room, RoomMessage } from '@prisma/client'
import { prisma } from '~~/prisma/client'
import { SocketHandler } from '~~/types/socket.io'

export default {
  event: 'room:join',
  handler: async (socket, data, callback) => {
    const room = await prisma.room.findUnique({
      where: { id: data?.id },
      include: { messages: true },
    })

    if (!room) return

    socket.join(room.id)

    callback?.({ room, messages: room.messages })
  },
} as SocketHandler<{ id: string }, { room: Room | null; messages: RoomMessage[] }>
