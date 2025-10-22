import { defineNuxtPlugin } from 'nuxt/app'
import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'
import type { MainRouter } from '~~/server/trpc/routers/main'

export default defineNuxtPlugin(() => {
  const trpc = createTRPCNuxtClient<MainRouter>({
    links: [
      httpBatchLink({
        url: `/api/trpc`,
        fetchOptions: {
          onResponseError: (error) => {
            if (error.response.status === 401) {
              window.location.reload()
            }
          },
        },
      }),
    ],
  })

  return {
    provide: {
      trpc,
    },
  }
})
