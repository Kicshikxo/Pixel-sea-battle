import { TRPCError } from '@trpc/server'
import bcrypt from 'bcryptjs'
import crc32 from 'crc/crc32'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { trpcAuthProcedure } from '~/server/trpc/middleware/auth'
import type { AuthTokenData, SessionData } from '~/types/auth'

export const authRouter = trpcRouter({
  signup: trpcPublicProcedure
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
          message: 'User already exists',
        })
      }

      const user = await prisma.user.create({
        data: {
          email: input.email,
          password: bcrypt.hashSync(input.password, 8),
          username: input.username,
        },
      })

      return {
        id: user.id,
        email: user.email,
        username: user.username,
      } as SessionData
    }),
  signin: trpcPublicProcedure
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
          message: 'Incorrect login credentials',
        })
      }

      const token = jwt.sign(
        {
          id: user.id,
          password: crc32(user.password).toString(16),
        } as AuthTokenData,
        useRuntimeConfig().jwtSecretKey,
      )
      setCookie(ctx.event, useRuntimeConfig().authCookieName, token, {
        maxAge: 30 * 24 * 60 * 60,
        httpOnly: true,
        sameSite: true,
      })
    }),
  signout: trpcPublicProcedure.query(async ({ ctx }) => {
    deleteCookie(ctx.event, useRuntimeConfig().authCookieName)
  }),
  googleSignin: trpcPublicProcedure
    .input(
      z.object({
        accessToken: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const googleUser = (await new OAuth2Client(useRuntimeConfig().googleClientId).verifyIdToken({ idToken: input.accessToken })).getPayload()

      if (!googleUser || !googleUser.email) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Google user not found',
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
        useRuntimeConfig().jwtSecretKey,
      )
      setCookie(ctx.event, useRuntimeConfig().authCookieName, token, {
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
