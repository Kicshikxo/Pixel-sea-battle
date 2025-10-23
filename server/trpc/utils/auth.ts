import { User, UserSession } from '@prisma/client'
import { H3Event } from 'h3'
import { prisma } from '~~/prisma/client'

export const SESSION_EXPIRES_IN = 14 * 24 * 60 * 60

export async function createSession(event: H3Event, user: User) {
  const session = await prisma.userSession.create({
    data: {
      userId: user.id,
      expiredAt: new Date(Date.now() + SESSION_EXPIRES_IN * 1000),
    },
  })
  setCookie(event, useRuntimeConfig().public.auth.sessionKey, session.id, {
    maxAge: SESSION_EXPIRES_IN,
    httpOnly: true,
    sameSite: 'lax',
  })

  return session
}

export async function updateSession(event: H3Event, session: UserSession) {
  await prisma.userSession.update({
    where: { id: session.id },
    data: { expiredAt: new Date(Date.now() + SESSION_EXPIRES_IN * 1000) },
  })
  setCookie(event, useRuntimeConfig().public.auth.sessionKey, session.id, {
    maxAge: SESSION_EXPIRES_IN,
    httpOnly: true,
    sameSite: 'lax',
  })
}
