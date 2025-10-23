import { TRPCError } from '@trpc/server'
import { prisma } from '~~/prisma/client'
import { trpcMiddleware, trpcPublicProcedure } from '~~/server/trpc'
import { updateSession } from '~~/server/trpc/utils/auth'

export const authMiddleware = trpcMiddleware(async ({ ctx, next }) => {
  const sessionCookie = getCookie(ctx.event, useRuntimeConfig().public.auth.sessionKey)
  if (!sessionCookie) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'error.auth.unableToReadToken',
    })
  }

  const session = await prisma.userSession.findUnique({
    where: { id: sessionCookie },
  })
  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'error.auth.sessionNotFound',
    })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  })
  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'error.auth.userNotFound',
    })
  }

  await updateSession(ctx.event, session)

  return next({
    ctx: { user },
  })
})

export const trpcAuthProcedure = trpcPublicProcedure.use(authMiddleware)
