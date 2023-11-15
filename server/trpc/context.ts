import { inferAsyncReturnType } from '@trpc/server'
import { H3Event } from 'h3'

export const createContext = (event: H3Event) => ({ event })

export type Context = inferAsyncReturnType<typeof createContext>
