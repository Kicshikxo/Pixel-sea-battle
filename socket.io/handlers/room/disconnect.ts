import { type RoomPlayer, type User } from '@prisma/client'
import { prisma } from '~~/prisma/client'
import type { SocketHandler } from '~~/types/socket.io'

export default {
  event: 'room:disconnect',
  handler: async (socket, data, callback) => {
    if (!socket.user) return callback?.()

    const room = await prisma.room.findUnique({
      where: { id: data?.id, players: { some: { userId: socket.user.id } } },
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

    socket.leave(room.id)
    socket.to(room.id).emit('room:playerDisconnect', player)

    callback?.()
  },
} as SocketHandler<
  'room:disconnect',
  { id: string },
  void,
  [
    {
      event: 'room:playerDisconnect'
      data: RoomPlayer & {
        user: User
      }
    },
    {
      event: 'room:playerLeave'
      data: RoomPlayer & {
        user: User
      }
    },
  ]
>
