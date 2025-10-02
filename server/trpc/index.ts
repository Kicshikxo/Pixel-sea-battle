import { initTRPC } from '@trpc/server'
import { Context } from '~~/server/trpc/context'

const trpc = initTRPC.context<Context>().create()

export const trpcRouter = trpc.router
export const trpcMiddleware = trpc.middleware
export const trpcPublicProcedure = trpc.procedure
