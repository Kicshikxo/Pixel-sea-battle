import { trpcRouter } from '~~/server/trpc'
import { authRouter } from '~~/server/trpc/routers/auth'
import { emailConfirmationRouter } from '~~/server/trpc/routers/emailConfirmation'
import { passwordRecoveryRouter } from '~~/server/trpc/routers/passwordRecovery'

import { roomRouter } from '~~/server/trpc/routers/room'

export const mainRouter = trpcRouter({
  auth: authRouter,
  emailConfirmation: emailConfirmationRouter,
  passwordRecovery: passwordRecoveryRouter,
  room: roomRouter,
})

export type MainRouter = typeof mainRouter
