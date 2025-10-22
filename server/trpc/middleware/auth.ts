import { TRPCError } from '@trpc/server'
import { prisma } from '~~/prisma/client'
import { trpcMiddleware, trpcPublicProcedure } from '~~/server/trpc'
import { authorizeUser, readTokenData, verifyTokenPassword } from '~~/server/trpc/utils/auth'

export const authMiddleware = trpcMiddleware(async ({ ctx, next }) => {
  try {
    const headerAccessToken = getHeaders(ctx.event).authorization?.substring('Bearer '.length)
    const cookieAccessToken = getCookie(ctx.event, useRuntimeConfig().public.auth.accessTokenKey)

    const accessToken = headerAccessToken || cookieAccessToken
    if (!accessToken) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'error.auth.unableToReadToken',
      })
    }

    const tokenData = readTokenData(accessToken)
    if (!tokenData) {
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

    if (!verifyTokenPassword(tokenData, user)) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'error.auth.invalidTokenCredentials',
      })
    }

    return next({
      ctx: { user },
    })
  } catch (error) {
    const headerRefreshToken = getHeaders(ctx.event)['x-refresh-token']
    const cookieRefreshToken = getCookie(ctx.event, useRuntimeConfig().public.auth.refreshTokenKey)

    if (!(headerRefreshToken || cookieRefreshToken)) {
      throw error
    }

    const refreshToken = await prisma.userRefreshToken.findFirst({
      where: {
        token: headerRefreshToken || cookieRefreshToken,
      },
      include: { user: true },
    })
    if (!refreshToken) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'error.auth.invalidRefreshToken',
      })
    }

    const tokenData = readTokenData(refreshToken.token)
    if (!tokenData) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'error.auth.unableToReadTokenData',
      })
    }

    if (!verifyTokenPassword(tokenData, refreshToken.user)) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'error.auth.invalidTokenCredentials',
      })
    }

    await prisma.userRefreshToken.delete({
      where: {
        id: refreshToken.id,
      },
    })

    await authorizeUser(ctx.event, refreshToken.user)

    return next({
      ctx: { user: refreshToken.user },
    })
  }
})

export const trpcAuthProcedure = trpcPublicProcedure.use(authMiddleware)
