import useAuth from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.meta.auth === false) return

  const { session, getSession } = useAuth()

  if (session.status.value === 'unauthenticated') await getSession()
  if (session.status.value === 'authenticated') return

  return navigateTo(`/auth?redirectTo=${to.fullPath}`)
})
