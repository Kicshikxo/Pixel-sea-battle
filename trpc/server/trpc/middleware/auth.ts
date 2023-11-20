import { TRPCError } from '@trpc/server'
import crc32 from 'crc/crc32'
import jwt from 'jsonwebtoken'
import { prisma } from '~/prisma/client'
import type { AuthTokenData } from '~/types/auth'

export const authMiddleware = trpcMiddleware(async ({ ctx, next }) => {
  const headerToken = getHeaders(ctx.event).authorization?.substring('Bearer '.length)
  const cookieToken = getCookie(ctx.event, useRuntimeConfig().auth.cookieName)

  const token = headerToken || cookieToken
  if (!token) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unable to read token',
    })
  }

  let tokenData: AuthTokenData
  try {
    tokenData = jwt.verify(token, useRuntimeConfig().auth.jwtSecretKey) as AuthTokenData
  } catch (e) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unable to read token data',
    })
  }

  const user = await prisma.user.findUnique({
    where: { id: tokenData.id },
  })

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User not found',
    })
  }

  if (tokenData.password !== (user.password ? crc32(user.password).toString(16) : null)) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid token credentials',
    })
  }

  return next({
    ctx: { user },
  })
})

export const trpcAuthProcedure = trpcPublicProcedure.use(authMiddleware)
