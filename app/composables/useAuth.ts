import type { TRPCClientError } from '@trpc/client'
import { useState } from 'nuxt/app'
import { useRouter } from 'vue-router'
import useTRPC from '~/composables/useTRPC'
import type { AuthRouter } from '~~/server/trpc/routers/auth'
import type {
  GetSessionResult,
  GoogleSignInResult,
  GoogleSingInOptions,
  GuestSignInResult,
  GuestSingInOptions,
  SessionData,
  SignInResult,
  SignOutOptions,
  SignOutResult,
  SignUpOptions,
  SignUpResult,
  SingInOptions,
} from '~~/types/auth'

export default function useAuth() {
  const trpc = useTRPC()
  const router = useRouter()

  const sessionData = useState<SessionData | null>('session:data', () => null)
  const status = computed(() => (sessionData.value ? 'authenticated' : 'unauthenticated'))

  const signUp = async (options: SignUpOptions): Promise<SignUpResult> => {
    try {
      await trpc.auth.signUp.mutate({
        email: options.email,
        username: options.username,
        password: options.password,
      })
      await getSession()

      if (options.redirectTo) {
        router.push(options.redirectTo)
      }

      return {
        status: 200,
        error: null,
      }
    } catch (error) {
      const trpcError = error as TRPCClientError<AuthRouter>
      return {
        status: trpcError.shape?.data?.httpStatus ?? 200,
        error: trpcError.shape?.message ?? null,
      }
    }
  }

  const signIn = async (options: SingInOptions): Promise<SignInResult> => {
    try {
      await trpc.auth.signIn.mutate({
        email: options.email,
        password: options.password,
      })
      await getSession()

      if (options.redirectTo) {
        router.push(options.redirectTo)
      }

      return {
        status: 200,
        error: null,
      }
    } catch (error) {
      const trpcError = error as TRPCClientError<AuthRouter>
      return {
        status: trpcError.shape?.data?.httpStatus ?? 200,
        error: trpcError.shape?.message ?? null,
      }
    }
  }

  const signOut = async (options?: SignOutOptions): Promise<SignOutResult> => {
    try {
      await trpc.auth.signOut.mutate()
      sessionData.value = null

      if (options?.redirectTo) {
        router.push(options.redirectTo)
      }

      return {
        status: 200,
        error: null,
      }
    } catch (error) {
      const trpcError = error as TRPCClientError<AuthRouter>
      return {
        status: trpcError.shape?.data?.httpStatus ?? 200,
        error: trpcError.shape?.message ?? null,
      }
    }
  }

  const googleSignIn = async (options: GoogleSingInOptions): Promise<GoogleSignInResult> => {
    try {
      await trpc.auth.googleSignIn.mutate({
        idToken: options.idToken,
      })
      await getSession()

      if (options.redirectTo) {
        router.push(options.redirectTo)
      }

      return {
        status: 200,
        error: null,
      }
    } catch (error) {
      const trpcError = error as TRPCClientError<AuthRouter>
      return {
        status: trpcError.shape?.data?.httpStatus ?? 200,
        error: trpcError.shape?.message ?? null,
      }
    }
  }

  const guestSignIn = async (options: GuestSingInOptions): Promise<GuestSignInResult> => {
    try {
      await trpc.auth.guestSignIn.mutate()
      await getSession()

      if (options.redirectTo) {
        router.push(options.redirectTo)
      }

      return {
        status: 200,
        error: null,
      }
    } catch (error) {
      const trpcError = error as TRPCClientError<AuthRouter>
      return {
        status: trpcError.shape?.data?.httpStatus ?? 200,
        error: trpcError.shape?.message ?? null,
      }
    }
  }

  const getSession = async (): Promise<GetSessionResult> => {
    try {
      const data = await trpc.auth.session.query()

      sessionData.value = data

      return {
        status: 200,
        error: null,
        data,
      }
    } catch (error) {
      sessionData.value = null

      const trpcError = error as TRPCClientError<AuthRouter>
      return {
        status: trpcError.shape?.data?.httpStatus ?? 200,
        error: trpcError.shape?.message ?? null,
        data: null,
      }
    }
  }

  return {
    signUp,
    signIn,
    signOut,
    googleSignIn,
    guestSignIn,
    getSession,
    session: {
      data: sessionData,
      status,
    },
  }
}
