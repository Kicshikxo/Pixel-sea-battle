import type { RoomPlayer, User } from '@prisma/client'
import { prisma } from '~~/prisma/client'
import { io } from '~~/socket.io'
import type { SocketHandler } from '~~/types/socket.io'

export default {
  event: 'room:chat:typing:stop',
  handler: async (socket, data, callback) => {
    if (!socket.user) return callback?.()

    const room = await prisma.room.findUnique({
      where: { id: data.roomId, players: { some: { userId: socket.user.id } } },
    })
    if (!room) return callback?.()

    const player = await prisma.roomPlayer.findUnique({
      where: {
        userId_roomId: {
          userId: socket.user.id,
          roomId: room.id,
        },
      },
      include: {
        user: true,
      },
    })
    if (!player) return callback?.()

    io.server.to(data.roomId).emit('room:chat:typing:stop', player)

    callback?.()
  },
} as SocketHandler<
  'room:chat:typing:stop',
  { roomId: string },
  void,
  [
    {
      event: 'room:chat:typing:stop'
      data: RoomPlayer & { user: User }
    },
  ]
>
