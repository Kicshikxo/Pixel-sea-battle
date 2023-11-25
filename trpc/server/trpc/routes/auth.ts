import { TRPCError } from '@trpc/server'
import bcrypt from 'bcryptjs'
import crc32 from 'crc/crc32'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import type { AuthTokenData, SessionData } from '~/auth/types'
import { sendVerificationEmail } from '~/email'
import { prisma } from '~/prisma/client'
import { trpcAuthProcedure } from '~/trpc/server/trpc/middleware/auth'

export const authRouter = trpcRouter({
  signUp: trpcPublicProcedure
    .input(
      z.object({
        email: z.string().email(),
        username: z.string(),
        password: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      })

      if (existingUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'error.BAD_REQUEST.userAlreadyExists',
        })
      }

      const user = await prisma.user.create({
        data: {
          email: input.email,
          password: bcrypt.hashSync(input.password, 8),
          username: input.username,
        },
      })

      const token = jwt.sign(
        {
          id: user.id,
          password: crc32(user.password!).toString(16),
        } as AuthTokenData,
        useRuntimeConfig().auth.jwtSecretKey,
      )
      setCookie(ctx.event, useRuntimeConfig().auth.cookieName, token, {
        maxAge: 30 * 24 * 60 * 60,
        httpOnly: true,
        sameSite: true,
      })

      sendVerificationEmail(ctx.event, user.email)
    }),
  signIn: trpcPublicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await prisma.user.findFirst({
        where: { email: input.email },
      })

      if (!user || !user.password || !bcrypt.compareSync(input.password, user.password)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'error.UNAUTHORIZED.incorrectLoginCredentials',
        })
      }

      const token = jwt.sign(
        {
          id: user.id,
          password: crc32(user.password).toString(16),
        } as AuthTokenData,
        useRuntimeConfig().auth.jwtSecretKey,
      )
      setCookie(ctx.event, useRuntimeConfig().auth.cookieName, token, {
        maxAge: 30 * 24 * 60 * 60,
        httpOnly: true,
        sameSite: true,
      })
    }),
  signOut: trpcPublicProcedure.query(async ({ ctx }) => {
    deleteCookie(ctx.event, useRuntimeConfig().auth.cookieName)
  }),
  googleSignIn: trpcPublicProcedure
    .input(
      z.object({
        accessToken: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const googleUser = (await new OAuth2Client().verifyIdToken({ idToken: input.accessToken, audience: useRuntimeConfig().auth.googleClientId })).getPayload()

      if (!googleUser || !googleUser.email) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'error.UNAUTHORIZED.googleUserNotFound',
        })
      }

      const user = await prisma.user.upsert({
        where: {
          email: googleUser.email,
        },
        create: {
          email: googleUser.email,
          username: googleUser.name ?? googleUser.email,
          emailVerifiedAt: googleUser.email_verified ? new Date() : undefined,
        },
        update: {},
      })

      const token = jwt.sign(
        {
          id: user.id,
          password: user.password ? crc32(user.password).toString(16) : null,
        } as AuthTokenData,
        useRuntimeConfig().auth.jwtSecretKey,
      )
      setCookie(ctx.event, useRuntimeConfig().auth.cookieName, token, {
        maxAge: 30 * 24 * 60 * 60,
        httpOnly: true,
        sameSite: true,
      })
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
