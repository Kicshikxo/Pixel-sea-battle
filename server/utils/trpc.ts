import { initTRPC } from '@trpc/server'
import type { Context } from '~/server/trpc/context'

const t = initTRPC.context<Context>().create()

export const trpcRouter = t.router
export const trpcMiddleware = t.middleware
export const trpcPublicProcedure = t.procedure
