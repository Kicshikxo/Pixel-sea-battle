import { createNuxtApiHandler } from 'trpc-nuxt'
import { createContext } from '~/server/trpc/context'
import { mainRouter } from '~/server/trpc/routes/main'

export default createNuxtApiHandler({
  router: mainRouter,
  createContext,
})
