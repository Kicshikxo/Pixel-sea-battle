import { RoomStatus, type Room, type RoomPlayer, type User } from '@prisma/client'
import { prisma } from '~~/prisma/client'
import type { SocketHandler } from '~~/types/socket.io'

export default {
  event: 'rooms:list',
  handler: async (socket, data, callback) => {
    if (!socket.user) return callback?.()

    const rooms = await prisma.room.findMany({
      where: {
        status: {
          not: RoomStatus.FINISHED,
        },
      },
      include: {
        players: {
          include: { user: true },
        },
      },
    })

    callback?.(rooms)
  },
} as SocketHandler<
  'rooms:list',
  void,
  (Room & { players: (RoomPlayer & { user: User })[] })[],
  [
    {
      event: 'rooms:updateRoom'
      data: Room & { players: (RoomPlayer & { user: User })[] }
    },
  ]
>
