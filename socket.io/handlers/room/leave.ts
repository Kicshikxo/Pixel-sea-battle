import type { RoomPlayer, User } from '@prisma/client'
import { prisma } from '~~/prisma/client'
import type { SocketHandler } from '~~/types/socket.io'

export default {
  event: 'room:leave',
  handler: async (socket, data, callback) => {
    if (!socket.user) return

    const room = await prisma.room.findUnique({
      where: { id: data?.id, players: { some: { userId: socket.user.id } } },
    })
    if (!room) return

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
    if (!player) return

    socket.leave(room.id)
    socket.to(room.id).emit('room:playerLeave', player)

    callback?.()
  },
} as SocketHandler<
  'room:leave',
  { id: string },
  null,
  [
    {
      event: 'room:playerLeave'
      data: RoomPlayer & {
        user: User
      }
    },
  ]
>
