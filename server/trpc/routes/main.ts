import { z } from 'zod'
import { io } from '~/server/socket.io'
import { trpcAuthProcedure } from '~/server/trpc/middleware/auth'
import { authRouter } from '~/server/trpc/routes/auth'
import { emailRouter } from '~/server/trpc/routes/email'

export const mainRouter = trpcRouter({
  auth: authRouter,
  email: emailRouter,
  hello: trpcAuthProcedure
    .input(
      z.object({
        text: z.string().nullish(),
      }),
    )
    .query(({ ctx, input }) => {
      io.server.sockets.emit('message', { message: `hello everyone with text: ${input.text}` })
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
      }
    }),
})

export type MainRouter = typeof mainRouter
