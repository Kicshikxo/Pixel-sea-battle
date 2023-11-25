import { authRouter } from '~/trpc/server/trpc/routes/auth'
import { emailRouter } from '~/trpc/server/trpc/routes/email'
import { roomRouter } from '~/trpc/server/trpc/routes/room'

export const mainRouter = trpcRouter({
  auth: authRouter,
  email: emailRouter,
  room: roomRouter,
})

export type MainRouter = typeof mainRouter
