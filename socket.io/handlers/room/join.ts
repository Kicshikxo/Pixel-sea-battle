import type { Room, RoomMessage, User } from '@prisma/client'
import { prisma } from '~~/prisma/client'
import type { SocketHandler } from '~~/types/socket.io'

export default {
  event: 'room:join',
  handler: async (socket, data, callback) => {
    if (!socket.user) return

    const room = await prisma.room.findUnique({
      where: { id: data?.id, players: { some: { userId: socket.user.id } } },
      include: {
        messages: {
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    if (!room) return

    socket.join(room.id)

    callback?.({ room, messages: room.messages })
  },
} as SocketHandler<
  'room:join',
  { id: string },
  { room: Room | null; messages: (RoomMessage & { user: User })[] }
>
