export interface SignUpOptions {
  email: string
  username: string
  password: string
  redirectTo?: string
}
export interface SignUpResult {
  status: number
  error: string | null
  data: SessionData | null
}

export interface SingInOptions {
  email: string
  password: string
  redirectTo?: string
}
export interface SignInResult {
  status: number
  error: string | null
}

export interface GoogleSingInOptions {
  accessToken: string
  redirectTo?: string
}
export interface GoogleSignInResult {
  status: number
  error: string | null
}

export interface GuestSingInOptions {
  redirectTo?: string
}
export interface GuestSignInResult {
  status: number
  error: string | null
}

export interface SignOutOptions {
  redirectTo?: string
}
export interface SignOutResult {
  status: number
  error: string | null
}

export interface AuthTokenData {
  id: string
  password: string | null
}

export interface SessionData {
  id: string
  email: string
  username: string
}
export interface GetSessionResult {
  status: number
  error: string | null
  data: SessionData | null
}
