import { UserType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library'
import { z } from 'zod'
import { prisma } from '~~/prisma/client'
import { sendEmailConfirmation } from '~~/server/email'
import { trpcPublicProcedure, trpcRouter } from '~~/server/trpc'
import { trpcAuthProcedure } from '~~/server/trpc/middleware/auth'
import type { SessionData } from '~~/types/auth'
import { createSession } from '../utils/auth'

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

      return await createSession(ctx.event, user)
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

      return await createSession(ctx.event, user)
    }),

  signOut: trpcPublicProcedure.mutation(async ({ ctx }) => {
    const sessionCookie = getCookie(ctx.event, useRuntimeConfig().public.auth.sessionKey)
    if (sessionCookie) {
      try {
        await prisma.userSession.deleteMany({
          where: {
            userId: sessionCookie,
          },
        })
      } finally {
        deleteCookie(ctx.event, useRuntimeConfig().public.auth.sessionKey)
      }
    }
  }),

  googleSignIn: trpcPublicProcedure
    .input(
      z.object({
        idToken: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const googleUser = (
        await new OAuth2Client().verifyIdToken({
          idToken: input.idToken,
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

      return await createSession(ctx.event, user)
    }),

  guestSignIn: trpcPublicProcedure.mutation(async ({ ctx }) => {
    const user = await prisma.user.create({
      data: {
        type: UserType.GUEST,
        username: `guest-${new Date().getTime()}`,
      },
    })

    return await createSession(ctx.event, user)
  }),

  info: trpcAuthProcedure.query(async ({ ctx }) => {
    return ctx.user
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
