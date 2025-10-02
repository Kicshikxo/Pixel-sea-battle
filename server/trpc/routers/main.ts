import { trpcRouter } from '~~/server/trpc'
import { authRouter } from '~~/server/trpc/routers/auth'
import { emailRouter } from '~~/server/trpc/routers/email'
import { roomRouter } from '~~/server/trpc/routers/room'

export const mainRouter = trpcRouter({
  auth: authRouter,
  email: emailRouter,
  room: roomRouter,
})

export type MainRouter = typeof mainRouter
