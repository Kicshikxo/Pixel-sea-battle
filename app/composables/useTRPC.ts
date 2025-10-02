import { useNuxtApp } from '#app'

export default () => {
  const { $trpc } = useNuxtApp()

  return $trpc
}
