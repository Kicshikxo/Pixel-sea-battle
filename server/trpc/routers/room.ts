import { RoomStatus, RoomType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { prisma } from '~~/prisma/client'
import { trpcRouter } from '~~/server/trpc'
import { trpcAuthProcedure } from '~~/server/trpc/middleware/auth'

export const roomRouter = trpcRouter({
  info: trpcAuthProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await prisma.room.findUnique({ where: { id: input.id }, include: { messages: true } })
    }),

  listActive: trpcAuthProcedure.query(async ({ ctx }) => {
    const activeRooms = await prisma.room.findMany({
      where: {
        players: { some: { userId: ctx.user.id } },
        status: { not: RoomStatus.FINISHED },
      },
      include: { players: true },
    })

    return {
      response: activeRooms,
      total: activeRooms.length,
    }
  }),

  listPublic: trpcAuthProcedure.query(async ({ ctx }) => {
    const publicRooms = await prisma.room.findMany({
      where: {
        creatorId: { not: ctx.user.id },
        type: RoomType.PUBLIC,
      },
      include: { players: true },
    })

    const notFullPublicRooms = publicRooms.filter((room) => room.players.length < 2)

    return {
      response: notFullPublicRooms,
      total: notFullPublicRooms.length,
    }
  }),

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
      return await prisma.room.create({
        data: {
          name: input.name,
          type: input.type,
          creatorId: ctx.user.id,
        },
      })
    }),

  join: trpcAuthProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const room = await prisma.room.findUnique({
        where: { id: input.id, status: { not: RoomStatus.FINISHED } },
        include: { players: true },
      })

      if (!room) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.room.notFound',
        })
      }

      if (room.players.some(({ userId }) => userId === ctx.user.id)) {
        return room
      }

      if (room.players.length >= 2) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'error.room.isFull',
        })
      }

      return await prisma.room.update({
        where: { id: input.id },
        data: {
          players: {
            create: {
              userId: ctx.user.id,
            },
          },
        },
      })
    }),
})

export type RoomRouter = typeof roomRouter
