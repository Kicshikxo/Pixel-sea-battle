import { defineNuxtPlugin } from 'nuxt/app'
import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'
import type { MainRouter } from '~~/server/trpc/routers/main'

export default defineNuxtPlugin(() => {
  const toast = useToast()
  const { $i18n } = useNuxtApp()
  const { session } = useAuth()

  const trpc = createTRPCNuxtClient<MainRouter>({
    links: [
      httpBatchLink({
        url: `/api/trpc`,
        fetchOptions: {
          onResponseError(error) {
            if (error.response?.status === 401) {
              toast.error($i18n.t('error.auth.unauthorized'))

              if (session.status.value === 'authenticated') {
                window.location.reload()
              }
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
