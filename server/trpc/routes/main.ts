import { z } from 'zod'
import { trpcAuthProcedure } from '~/server/trpc/middleware/auth'
import { authRouter } from './auth'

export const mainRouter = trpcRouter({
  auth: authRouter,
  hello: trpcAuthProcedure
    .input(
      z.object({
        text: z.string().nullish(),
      }),
    )
    .query(({ ctx, input }) => {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
      }
    }),
})

export type MainRouter = typeof mainRouter
