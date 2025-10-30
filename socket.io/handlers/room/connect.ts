import type {
  GamePlayerShip,
  GamePlayerShot,
  Room,
  RoomMessage,
  RoomPlayer,
  User,
} from '@prisma/client'
import { prisma } from '~~/prisma/client'
import type { SocketHandler } from '~~/types/socket.io'

export default {
  event: 'room:connect',
  handler: async (socket, data, callback) => {
    if (!socket.user) return callback?.()

    const room = await prisma.room.findUnique({
      where: { id: data?.id, players: { some: { userId: socket.user.id } } },
      include: {
        messages: {
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        },
        players: {
          include: {
            user: true,
            ships: true,
            sourceShots: true,
            targetShots: true,
          },
        },
      },
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
        ships: true,
        sourceShots: true,
        targetShots: true,
      },
    })
    if (!player) return callback?.()

    socket.join(room.id)
    socket.to(room.id).emit('room:playerConnect', player)

    callback?.(room)
  },
} as SocketHandler<
  'room:connect',
  { id: string },
  Room & {
    messages: (RoomMessage & { user: User })[]
    players: (RoomPlayer & {
      user: User
      ships: GamePlayerShip[]
      sourceShots: GamePlayerShot[]
      targetShots: GamePlayerShot[]
    })[]
  },
  [
    {
      event: 'room:playerConnect'
      data: RoomPlayer & {
        user: User
        ships: GamePlayerShip[]
        sourceShots: GamePlayerShot[]
        targetShots: GamePlayerShot[]
      }
    },
    {
      event: 'room:playerJoin'
      data: RoomPlayer & {
        user: User
        ships: GamePlayerShip[]
        sourceShots: GamePlayerShot[]
        targetShots: GamePlayerShot[]
      }
    },
  ]
>
