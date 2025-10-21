import { TRPCError } from '@trpc/server'
import crc32 from 'crc/crc32'
import jwt from 'jsonwebtoken'
import { prisma } from '~~/prisma/client'
import { trpcMiddleware, trpcPublicProcedure } from '~~/server/trpc'
import type { AuthTokenData } from '~~/types/auth'

export const authMiddleware = trpcMiddleware(async ({ ctx, next }) => {
  const headerToken = getHeaders(ctx.event).authorization?.substring('Bearer '.length)
  const cookieToken = getCookie(ctx.event, useRuntimeConfig().public.auth.accessTokenKey)

  const token = headerToken || cookieToken
  if (!token) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'error.auth.unableToReadToken',
    })
  }

  let tokenData: AuthTokenData
  try {
    tokenData = jwt.verify(token, useRuntimeConfig().auth.jwtSecretKey) as AuthTokenData
  } catch (e) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'error.auth.unableToReadTokenData',
    })
  }

  const user = await prisma.user.findUnique({
    where: { id: tokenData.id },
  })

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'error.auth.userNotFound',
    })
  }

  if (tokenData.password !== (user.password ? crc32(user.password).toString(16) : null)) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'error.auth.invalidTokenCredentials',
    })
  }

  return next({
    ctx: { user },
  })
})

export const trpcAuthProcedure = trpcPublicProcedure.use(authMiddleware)
