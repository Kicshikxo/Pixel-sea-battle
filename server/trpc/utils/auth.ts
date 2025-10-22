import { User } from '@prisma/client'
import crc32 from 'crc/crc32'
import { H3Event } from 'h3'
import jwt from 'jsonwebtoken'
import { prisma } from '~~/prisma/client'
import type { AuthTokenData } from '~~/types/auth'

export function readTokenData(token: string): AuthTokenData | null {
  try {
    return jwt.verify(token, useRuntimeConfig().auth.jwtSecretKey) as AuthTokenData
  } catch {
    return null
  }
}

export function verifyTokenPassword(token: AuthTokenData, user: User) {
  return (
    token.id === user.id &&
    token.password === (user.password ? crc32(user.password).toString(16) : null)
  )
}

export async function authorizeUser(event: H3Event, user: User) {
  const ACCESS_TOKEN_EXPIRES_IN = 15 * 60
  const REFRESH_TOKEN_EXPIRES_IN = 14 * 24 * 60 * 60

  const accessToken = jwt.sign(
    {
      id: user.id,
      password: user.password ? crc32(user.password).toString(16) : null,
    } as AuthTokenData,
    useRuntimeConfig().auth.jwtSecretKey,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
  )
  const refreshToken = jwt.sign(
    {
      id: user.id,
      password: user.password ? crc32(user.password).toString(16) : null,
    } as AuthTokenData,
    useRuntimeConfig().auth.jwtSecretKey,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
  )

  setCookie(event, useRuntimeConfig().public.auth.accessTokenKey, accessToken, {
    maxAge: ACCESS_TOKEN_EXPIRES_IN,
    httpOnly: true,
    sameSite: 'lax',
  })
  setCookie(event, useRuntimeConfig().public.auth.refreshTokenKey, refreshToken, {
    maxAge: REFRESH_TOKEN_EXPIRES_IN,
    httpOnly: true,
    sameSite: 'strict',
  })

  await prisma.userRefreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiredAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000),
    },
  })

  return {
    accessToken,
    refreshToken,
  }
}
