import { defineNuxtPlugin } from 'nuxt/app'
import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'
import type { MainRouter } from '~~/server/trpc/routers/main'

export default defineNuxtPlugin(() => {
  const trpc = createTRPCNuxtClient<MainRouter>({
    links: [httpBatchLink({ url: '/api/trpc' })],
  })

  return {
    provide: {
      trpc,
    },
  }
})
