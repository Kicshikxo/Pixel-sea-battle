import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { prisma } from '~~/prisma/client'
import { trpcPublicProcedure, trpcRouter } from '~~/server/trpc'

export const emailConfirmationRouter = trpcRouter({
  info: trpcPublicProcedure
    .input(
      z.object({
        emailConfirmationId: z.string().uuid(),
      }),
    )
    .query(async ({ input }) => {
      const emailConfirmation = await prisma.emailConfirmation.findUnique({
        where: {
          id: input.emailConfirmationId,
          expiresAt: { gt: new Date() },
        },
        include: { user: true },
      })

      if (!emailConfirmation) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.emailConfirmation.notFound',
        })
      }

      if (emailConfirmation.user.emailVerifiedAt) {
        await prisma.emailConfirmation.delete({ where: { id: emailConfirmation.id } })
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.emailConfirmation.alreadyConfirmed',
        })
      }

      return emailConfirmation.user
    }),

  confirm: trpcPublicProcedure
    .input(
      z.object({
        emailConfirmationId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input }) => {
      const emailConfirmation = await prisma.emailConfirmation.findUnique({
        where: {
          id: input.emailConfirmationId,
          expiresAt: { gt: new Date() },
        },
        include: { user: true },
      })

      if (!emailConfirmation) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.emailConfirmation.notFound',
        })
      }

      if (emailConfirmation.user.emailVerifiedAt) {
        await prisma.emailConfirmation.delete({ where: { id: emailConfirmation.id } })
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.emailConfirmation.alreadyConfirmed',
        })
      }

      await prisma.user.update({
        where: { id: emailConfirmation.userId },
        data: { emailVerifiedAt: new Date() },
      })
      await prisma.emailConfirmation.delete({ where: { id: emailConfirmation.id } })
    }),
})

export type EmailConfirmationRouter = typeof emailConfirmationRouter
