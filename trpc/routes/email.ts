import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { prisma } from '~/prisma/client'

export const emailRouter = trpcRouter({
  info: trpcPublicProcedure
    .input(
      z.object({
        emailConfirmationId: z.string().uuid(),
      }),
    )
    .query(async ({ input }) => {
      const emailConfirmation = await prisma.emailConfirmation.findUnique({ where: { id: input.emailConfirmationId }, include: { user: true } })

      if (!emailConfirmation) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email confirmation id not found',
        })
      }

      if (!emailConfirmation.user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email confirmation user not found',
        })
      }

      if (emailConfirmation.user.emailVerifiedAt) {
        await prisma.emailConfirmation.delete({ where: { id: emailConfirmation.id } })
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email already confirmed',
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
    .query(async ({ input }) => {
      const emailConfirmation = await prisma.emailConfirmation.findUnique({ where: { id: input.emailConfirmationId }, include: { user: true } })

      if (!emailConfirmation) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email confirmation id not found',
        })
      }

      if (emailConfirmation.user.emailVerifiedAt) {
        await prisma.emailConfirmation.delete({ where: { id: emailConfirmation.id } })
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email already confirmed',
        })
      }

      await prisma.user.update({ where: { id: emailConfirmation.userId }, data: { emailVerifiedAt: new Date() } })
      await prisma.emailConfirmation.delete({ where: { id: emailConfirmation.id } })
    }),
})

export type EmailRouter = typeof emailRouter
