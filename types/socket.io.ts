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

export type ServerToClientEvents = {
  [Handler in keyof typeof handlers as keyof SocketHandlerEmits<
    (typeof handlers)[Handler]
  >]: SocketHandlerEmits<(typeof handlers)[Handler]>[keyof SocketHandlerEmits<
    (typeof handlers)[Handler]
  >]
}

export type ClientToServerEvents = {
  [Handler in keyof typeof handlers as (typeof handlers)[Handler]['event']]: SocketHandlerFunction<
    (typeof handlers)[Handler]
  >
}
