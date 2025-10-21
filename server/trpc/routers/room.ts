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

  listPublic: trpcAuthProcedure.query(async ({ ctx }) => {
    return {
      response: await prisma.room.findMany({
        where: {
          creatorId: { not: ctx.user.id },
          type: RoomType.PUBLIC,
        },
        include: { states: true },
      }),
      total: await prisma.room.count({
        where: {
          creatorId: { not: ctx.user.id },
          type: RoomType.PUBLIC,
        },
      }),
    }
  }),

  listActive: trpcAuthProcedure.query(async ({ ctx }) => {
    return {
      response: await prisma.room.findMany({
        where: {
          states: { some: { userId: ctx.user.id } },
          status: { not: RoomStatus.FINISHED },
        },
        include: { states: true },
      }),
      total: await prisma.room.count({
        where: {
          states: { some: { userId: ctx.user.id } },
          status: { not: RoomStatus.FINISHED },
        },
      }),
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
        include: { states: true },
      })

      if (!room) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.room.notFound',
        })
      }

      if (room.states.some(({ userId }) => userId === ctx.user.id)) {
        return room
      }

      if (room.states.length >= 2) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'error.room.isFull',
        })
      }

      return await prisma.room.update({
        where: { id: input.id },
        data: {
          states: {
            create: {
              userId: ctx.user.id,
            },
          },
        },
      })
    }),
})

export type RoomRouter = typeof roomRouter
