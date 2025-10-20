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

  listPublic: trpcAuthProcedure.query(async () => {
    return {
      response: await prisma.room.findMany({
        where: { type: RoomType.PUBLIC },
        include: { users: true },
      }),
      total: await prisma.room.count(),
    }
  }),

  listActive: trpcAuthProcedure.query(async ({ ctx }) => {
    return {
      response: await prisma.room.findMany({
        where: {
          users: { some: { userId: ctx.user.id } },
          status: { not: RoomStatus.FINISHED },
        },
        include: { users: true },
      }),
      total: await prisma.room.count(),
    }
  }),

  create: trpcAuthProcedure
    .input(
      z
        .object({
          type: z.enum([RoomType.PUBLIC, RoomType.PRIVATE]),
        })
        .default({
          type: RoomType.PUBLIC,
        }),
    )
    .query(async ({ ctx, input }) => {
      return await prisma.room.create({
        data: {
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
    .query(async ({ ctx, input }) => {
      const room = await prisma.room.findUnique({
        where: { id: input.id, status: { not: RoomStatus.FINISHED } },
        include: { users: true },
      })

      if (!room) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.room.notFound',
        })
      }

      if (room.users.some(({ userId }) => userId === ctx.user.id)) {
        return room
      }

      if (room.users.length >= 2) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'error.room.isFull',
        })
      }

      return await prisma.room.update({
        where: { id: input.id },
        data: {
          users: {
            create: {
              userId: ctx.user.id,
            },
          },
        },
      })
    }),
})

export type RoomRouter = typeof roomRouter
