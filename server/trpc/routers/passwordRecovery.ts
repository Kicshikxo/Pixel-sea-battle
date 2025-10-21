import { TRPCError } from '@trpc/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '~~/prisma/client'
import { sendPasswordRecovery } from '~~/server/email'
import { trpcPublicProcedure, trpcRouter } from '~~/server/trpc'

export const passwordRecoveryRouter = trpcRouter({
  send: trpcPublicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await sendPasswordRecovery(ctx.event, input.email)
    }),

  info: trpcPublicProcedure
    .input(
      z.object({
        passwordRecoveryId: z.string().uuid(),
      }),
    )
    .query(async ({ input }) => {
      const passwordRecovery = await prisma.passwordRecovery.findUnique({
        where: {
          id: input.passwordRecoveryId,
          expiredAt: { gt: new Date() },
        },
        include: { user: true },
      })

      if (!passwordRecovery) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.passwordRecovery.notFound',
        })
      }

      return passwordRecovery.user
    }),

  change: trpcPublicProcedure
    .input(
      z.object({
        passwordRecoveryId: z.string().uuid(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const passwordRecovery = await prisma.passwordRecovery.findUnique({
        where: { id: input.passwordRecoveryId },
        include: { user: true },
      })

      if (!passwordRecovery) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.passwordRecovery.notFound',
        })
      }

      await prisma.user.update({
        where: { id: passwordRecovery.userId },
        data: { password: bcrypt.hashSync(input.password, 8) },
      })
      await prisma.passwordRecovery.delete({ where: { id: passwordRecovery.id } })
    }),
})

export type PasswordRecoveryRouter = typeof passwordRecoveryRouter
