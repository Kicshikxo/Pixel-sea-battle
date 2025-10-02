import { createTRPCNuxtHandler } from 'trpc-nuxt/server'
import { createTRPCContext } from '~~/server/trpc/context'
import { mainRouter } from '~~/server/trpc/routers/main'

export default createTRPCNuxtHandler({
  endpoint: '/api/trpc',
  router: mainRouter,
  createContext: createTRPCContext,
})
