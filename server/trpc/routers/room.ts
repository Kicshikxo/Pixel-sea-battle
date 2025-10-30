import { RoomStatus, RoomType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { prisma } from '~~/prisma/client'
import { trpcRouter } from '~~/server/trpc'
import { trpcAuthProcedure } from '~~/server/trpc/middleware/auth'
import { io } from '~~/socket.io'

const globalPromises: Record<string, Promise<any>> = {}

function globalPromise<T>(name: string, promise: () => Promise<T>): Promise<T> {
  const lastPromise = globalPromises[name] ?? Promise.resolve()
  const nextPromise = lastPromise.then(() => promise())
  globalPromises[name] = nextPromise.catch(() => {})
  return nextPromise
}

export const roomRouter = trpcRouter({
  create: trpcAuthProcedure
    .input(
      z
        .object({
          name: z.string().min(1).max(100),
          type: z.enum([RoomType.PUBLIC, RoomType.PRIVATE]),
        })
        .default({
          name: '',
          type: RoomType.PUBLIC,
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingRoom = await prisma.room.findFirst({
        where: {
          name: input.name,
          status: { not: RoomStatus.FINISHED },
        },
      })
      if (existingRoom) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.room.nameAlreadyExists',
        })
      }

      const room = await prisma.room.create({
        data: {
          name: input.name,
          type: input.type,
          creatorId: ctx.user.id,
        },
      })

      const game = await prisma.game.create({
        data: {
          roomId: room.id,
        },
      })

      const updatedRoom = await prisma.room.update({
        where: { id: room.id },
        data: { currentGameId: game.id },
        include: {
          players: {
            include: { user: true },
          },
        },
      })

      io.server.emit('rooms:updateRoom', updatedRoom)

      return room
    }),

  join: trpcAuthProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedRoom = await globalPromise(input.id, async () => {
        const room = await prisma.room.findUnique({
          where: { id: input.id, status: RoomStatus.PENDING },
          include: {
            players: {
              include: { user: true },
            },
          },
        })
        if (!room) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'error.room.notFound',
          })
        }

        if (room.players.some((player) => player.userId === ctx.user.id)) {
          return room
        }

        if (room.players.length >= 2) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'error.room.isFull',
          })
        }

        return await prisma.room.update({
          where: { id: room.id },
          data: {
            players: {
              create: {
                userId: ctx.user.id,
              },
            },
          },
          include: {
            players: {
              include: { user: true },
            },
          },
        })
      })

      io.server.emit('rooms:updateRoom', updatedRoom)

      const player = await prisma.roomPlayer.findUnique({
        where: {
          userId_roomId: {
            userId: ctx.user.id,
            roomId: updatedRoom.id,
          },
        },
        include: {
          user: true,
          ships: true,
          sourceShots: true,
          targetShots: true,
        },
      })
      if (player) {
        io.server.to(updatedRoom.id).emit('room:playerJoin', player)
      }

      return updatedRoom
    }),

  quickJoin: trpcAuthProcedure.mutation(async ({ ctx }) => {
    const updatedRoom = await globalPromise(ctx.user.id, async () => {
      const publicRooms = await prisma.room.findMany({
        where: {
          type: RoomType.PUBLIC,
          status: RoomStatus.PENDING,
          players: {
            none: { userId: ctx.user.id },
          },
        },
        include: { players: true },
      })

      const availablePublicRooms = publicRooms.filter((room) => room.players.length < 2)

      if (!availablePublicRooms.length) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.room.notFound',
        })
      }

      const randomPublicRoom =
        availablePublicRooms[Math.floor(Math.random() * availablePublicRooms.length)]

      return await prisma.room.update({
        where: { id: randomPublicRoom.id },
        data: {
          players: {
            create: {
              userId: ctx.user.id,
            },
          },
        },
        include: {
          players: {
            include: { user: true },
          },
        },
      })
    })

    io.server.emit('rooms:updateRoom', updatedRoom)

    const player = await prisma.roomPlayer.findUnique({
      where: {
        userId_roomId: {
          userId: ctx.user.id,
          roomId: updatedRoom.id,
        },
      },
      include: {
        user: true,
        ships: true,
        sourceShots: true,
        targetShots: true,
      },
    })
    if (player) {
      io.server.to(updatedRoom.id).emit('room:playerJoin', player)
    }

    return updatedRoom
  }),

  leave: trpcAuthProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { player, updatedRoom } = await globalPromise(input.id, async () => {
        const room = await prisma.room.findUnique({
          where: { id: input.id, status: RoomStatus.PENDING },
          include: { players: true },
        })
        if (!room) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'error.room.notFound',
          })
        }

        const player = await prisma.roomPlayer.findUnique({
          where: {
            userId_roomId: {
              userId: ctx.user.id,
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
        if (!player) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'error.room.notJoined',
          })
        }

        const updatedRoom = await prisma.room.update({
          where: { id: room.id },
          data: {
            players: {
              delete: {
                userId_roomId: {
                  userId: ctx.user.id,
                  roomId: room.id,
                },
              },
            },
          },
          include: {
            players: {
              include: { user: true },
            },
          },
        })

        return { player, updatedRoom }
      })

      io.server.emit('rooms:updateRoom', updatedRoom)
      io.server.to(updatedRoom.id).emit('room:playerLeave', player)

      return updatedRoom
    }),
})

export type RoomRouter = typeof roomRouter
