import type { TRPCClientError } from '@trpc/client'
import { defineNuxtPlugin } from 'nuxt/app'
import { FetchError } from 'ofetch'
import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'
import type { AuthRouter } from '~~/server/trpc/routers/auth'
import type { MainRouter } from '~~/server/trpc/routers/main'

export default defineNuxtPlugin(() => {
  const toast = useToast()
  const { $i18n } = useNuxtApp()

  const trpcRaw = createTRPCNuxtClient<MainRouter>({
    links: [httpBatchLink({ url: `/api/trpc` })],
  })

  const trpc = createTRPCNuxtClient<MainRouter>({
    links: [
      httpBatchLink({
        url: `/api/trpc`,
        async fetch(input, init) {
          const customFetch = async (input: URL | RequestInfo, init?: RequestInit) => {
            const response = await $fetch.raw(input.toString(), init as any).catch((error) => {
              if (error instanceof FetchError) return error.response
              throw error
            })

            response!.json = () => Promise.resolve(response!._data)

            return response!
          }

          const response = await customFetch(input, init)

          if (import.meta.client) {
            const refreshToken = localStorage.getItem(
              useRuntimeConfig().public.auth.refreshTokenKey,
            )

            if (response?.status === 401 && refreshToken) {
              try {
                const refreshResponse = await trpcRaw.auth.refresh.mutate({
                  refreshToken,
                })

                localStorage.setItem(
                  useRuntimeConfig().public.auth.refreshTokenKey,
                  refreshResponse.refreshToken,
                )

                return await customFetch(input, init)
              } catch (error) {
                const trpcError = error as TRPCClientError<AuthRouter>
                toast.error($i18n.t(trpcError.message))

                localStorage.removeItem(useRuntimeConfig().public.auth.refreshTokenKey)

                window.location.reload()
              }
            }
          }

          return response
        },
      }),
    ],
  })

  return {
    provide: {
      trpc: trpc,
    },
  }
})
