import { H3Event } from 'h3'

export const createTRPCContext = (event: H3Event) => ({ event })

export type Context = ReturnType<typeof createTRPCContext>
