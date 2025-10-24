import type { User } from '@prisma/client'
import { Socket } from 'socket.io'
import * as handlers from '~~/socket.io/handlers'

export interface SocketHandler<
  Event extends string,
  Data = any,
  Response = any,
  Emits extends SocketHandlerEmit<any>[] = [],
> {
  readonly event: Event
  handler: (
    socket: Socket & { user?: User | null },
    data: Data,
    callback?: (response?: Response) => void,
  ) => void
}

export type SocketHandlerFunction<Handler extends SocketHandler<any>> =
  Handler extends SocketHandler<any, infer Data, infer Response>
    ? (data: Data, callback?: (response?: Response) => void) => void
    : (data: any, callback?: (response?: any) => void) => void

export interface SocketHandlerEmit<Event extends string, Data = any> {
  readonly event: Event
  readonly data: Data
}

export type SocketHandlerEmits<Handler extends SocketHandler<any>> =
  Handler extends SocketHandler<any, any, any, infer Emits>
    ? { [Emit in Emits[number] as Emit['event']]: (data: Emit['data']) => void }
    : {}

export interface SocketMiddleware {
  name: string
  handler: (socket: Socket & { user?: User | null }, next?: () => void) => void
}

export type Handlers = typeof handlers
export type Emits<Handler extends keyof Handlers> = SocketHandlerEmits<Handlers[Handler]>

export type ServerToClientEvents = {
  [Handler in keyof Handlers as keyof Emits<Handler>]: Emits<Handler>[keyof Emits<Handler>]
}

export type ClientToServerEvents = {
  [Handler in keyof Handlers as Handlers[Handler]['event']]: SocketHandlerFunction<
    Handlers[Handler]
  >
}
