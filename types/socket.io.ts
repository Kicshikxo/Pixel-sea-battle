import { Socket } from 'socket.io'

export interface SocketHandler<Data = any, Response = any> {
  event: string
  handler: (socket: Socket, data: Data, callback: (response?: Response) => void) => void
}

export interface SocketMiddleware {
  name: string
  handler: (socket: Socket, next?: () => void) => void
}
