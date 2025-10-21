import { User, UserType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcryptjs'
import crc32 from 'crc/crc32'
import { OAuth2Client } from 'google-auth-library'
import { H3Event } from 'h3'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '~~/prisma/client'
import { sendEmailConfirmation } from '~~/server/email'
import { trpcPublicProcedure, trpcRouter } from '~~/server/trpc'
import { trpcAuthProcedure } from '~~/server/trpc/middleware/auth'
import type { AuthTokenData, SessionData } from '~~/types/auth'

async function authorizeUser(event: H3Event, user: User) {
  const ACCESS_TOKEN_EXPIRES_IN = 15 * 60 // секунды
  const REFRESH_TOKEN_EXPIRES_IN = 14 * 24 * 60 * 60 // секунды

  const accessToken = jwt.sign(
    {
      id: user.id,
      password: user.password ? crc32(user.password).toString(16) : null,
    } as AuthTokenData,
    useRuntimeConfig().auth.jwtSecretKey,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
  )
  const refreshToken = jwt.sign(
    {
      id: user.id,
      password: user.password ? crc32(user.password).toString(16) : null,
    } as AuthTokenData,
    useRuntimeConfig().auth.jwtSecretKey,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
  )

  setCookie(event, useRuntimeConfig().public.auth.accessTokenKey, accessToken, {
    maxAge: ACCESS_TOKEN_EXPIRES_IN,
    httpOnly: true,
    sameSite: true,
  })

  await prisma.userRefreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiredAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000),
    },
  })

  return {
    accessToken,
    refreshToken,
  }
}

export const authRouter = trpcRouter({
  signUp: trpcPublicProcedure
    .input(
      z.object({
        email: z.string().email(),
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      })

      if (existingUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.auth.userAlreadyExists',
        })
      }

      const user = await prisma.user.create({
        data: {
          type: UserType.DEFAULT,
          email: input.email,
          password: bcrypt.hashSync(input.password, 8),
          username: input.username,
        },
      })

      sendEmailConfirmation(ctx.event, input.email)

      return await authorizeUser(ctx.event, user)
    }),

  signIn: trpcPublicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.findFirst({
        where: { email: input.email },
      })

      if (!user || !user.password || !bcrypt.compareSync(input.password, user.password)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'error.auth.incorrectLoginCredentials',
        })
      }

      return await authorizeUser(ctx.event, user)
    }),

  signOut: trpcPublicProcedure.mutation(async ({ ctx }) => {
    deleteCookie(ctx.event, useRuntimeConfig().public.auth.accessTokenKey)
  }),

  googleSignIn: trpcPublicProcedure
    .input(
      z.object({
        accessToken: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const googleUser = (
        await new OAuth2Client().verifyIdToken({
          idToken: input.accessToken,
          audience: useRuntimeConfig().auth.googleClientId,
        })
      ).getPayload()

      if (!googleUser || !googleUser.email) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'error.auth.googleUserNotFound',
        })
      }

      const user = await prisma.user.upsert({
        where: {
          email: googleUser.email,
        },
        create: {
          type: UserType.GOOGLE,
          email: googleUser.email,
          username: googleUser.name ?? googleUser.email,
          emailVerifiedAt: googleUser.email_verified ? new Date() : undefined,
        },
        update: {},
      })

      return await authorizeUser(ctx.event, user)
    }),

  guestSignIn: trpcPublicProcedure.mutation(async ({ ctx }) => {
    const user = await prisma.user.create({
      data: {
        type: UserType.GUEST,
        username: `guest-${new Date().getTime()}`,
      },
    })

    return await authorizeUser(ctx.event, user)
  }),

  refresh: trpcPublicProcedure
    .input(
      z.object({
        refreshToken: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const refreshToken = await prisma.userRefreshToken.findUnique({
        where: {
          token: input.refreshToken,
        },
        include: { user: true },
      })

      if (!refreshToken) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'error.auth.invalidRefreshToken',
        })
      }

      let tokenData: AuthTokenData
      try {
        tokenData = jwt.verify(
          refreshToken.token,
          useRuntimeConfig().auth.jwtSecretKey,
        ) as AuthTokenData
      } catch (e) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'error.auth.unableToReadTokenData',
        })
      }

      if (
        tokenData.password !==
        (refreshToken.user.password ? crc32(refreshToken.user.password).toString(16) : null)
      ) {
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

      return authorizeUser(ctx.event, refreshToken.user)
    }),

  session: trpcAuthProcedure.query(async ({ ctx }) => {
    return {
      id: ctx.user.id,
      email: ctx.user.email,
      username: ctx.user.username,
    } as SessionData
  }),
})

export type AuthRouter = typeof authRouter
