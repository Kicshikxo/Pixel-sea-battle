import type { SessionData } from '~/types/auth'

export default () => {
  const data = useState<SessionData | null>('session:data', () => null)
  const status = computed(() => (data.value ? 'authenticated' : 'unauthenticated'))

  return { data, status }
}
