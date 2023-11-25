import type { GetSessionResult, GoogleSignInResult, GoogleSingInOptions, SessionData, SignInResult, SignOutOptions, SignOutResult, SignUpOptions, SignUpResult, SingInOptions } from '~/auth/types'

const useAuthState = () => {
  const data = useState<SessionData | null>('session:data', () => null)
  const status = computed(() => (data.value ? 'authenticated' : 'unauthenticated'))

  return { data, status }
}

const signUp = async (options: SignUpOptions): Promise<SignUpResult> => {
  const client = useClient()
  const router = useRouter()

  const { data, error } = await client.auth.signUp.useQuery({
    email: options.email,
    username: options.username,
    password: options.password,
  })

  await getSession()

  if (options.redirectTo && !error.value) {
    router.push(options.redirectTo)
  }

  return {
    status: error.value?.data?.httpStatus ?? 200,
    error: error.value?.message ?? null,
    data: data.value,
  }
}

const signIn = async (options: SingInOptions): Promise<SignInResult> => {
  const client = useClient()
  const router = useRouter()

  const { error } = await client.auth.signIn.useQuery({
    email: options.email,
    password: options.password,
  })

  await getSession()

  if (options.redirectTo && !error.value) {
    router.push(options.redirectTo)
  }

  return {
    status: error.value?.data?.httpStatus ?? 200,
    error: error.value?.message ?? null,
  }
}

const signOut = async (options?: SignOutOptions): Promise<SignOutResult> => {
  const client = useClient()
  const router = useRouter()

  const { error } = await client.auth.signOut.useQuery()

  if (options?.redirectTo && !error.value) {
    router.push(options.redirectTo)
  }

  return {
    status: error.value?.data?.httpStatus ?? 200,
    error: error.value?.message ?? null,
  }
}

const googleSignIn = async (options: GoogleSingInOptions): Promise<GoogleSignInResult> => {
  const client = useClient()
  const router = useRouter()

  const { error } = await client.auth.googleSignIn.useQuery({
    accessToken: options.accessToken,
  })

  await getSession()

  if (options.redirectTo && !error.value) {
    router.push(options.redirectTo)
  }

  return {
    status: error.value?.data?.httpStatus ?? 200,
    error: error.value?.message ?? null,
  }
}

const getSession = async (): Promise<GetSessionResult> => {
  const client = useClient()
  const { data: sessionData } = useAuthState()

  const { data, error } = await client.auth.session.useQuery()

  sessionData.value = data.value

  return {
    status: error.value?.data?.httpStatus ?? 200,
    error: error.value?.message ?? null,
    data: data.value,
  }
}

export default () => {
  const { data, status } = useAuthState()

  return {
    signUp,
    signIn,
    signOut,
    googleSignIn,
    getSession,
    state: {
      data,
      status,
    },
  }
}
