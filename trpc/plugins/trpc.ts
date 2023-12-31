import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'
import type { MainRouter } from '~/trpc/server/trpc/routes/main'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      client: createTRPCNuxtClient<MainRouter>({
        links: [
          httpBatchLink({
            url: '/api/trpc',
          }),
        ],
      }),
    },
  }
})
