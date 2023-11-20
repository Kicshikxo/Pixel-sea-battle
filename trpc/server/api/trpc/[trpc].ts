import { createNuxtApiHandler } from 'trpc-nuxt'
import { createContext } from '~/trpc/server/trpc/context'
import { mainRouter } from '~/trpc/server/trpc/routes/main'

export default createNuxtApiHandler({
  router: mainRouter,
  createContext,
})
