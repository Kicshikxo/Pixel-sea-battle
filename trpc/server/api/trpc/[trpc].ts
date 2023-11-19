import { createNuxtApiHandler } from 'trpc-nuxt'
import { createContext } from '~/trpc/context'
import { mainRouter } from '~/trpc/routes/main'

export default createNuxtApiHandler({
  router: mainRouter,
  createContext,
})
