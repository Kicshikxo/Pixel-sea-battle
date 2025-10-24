import { Server as HttpServer } from 'node:http'
import { Server as SocketServer } from 'socket.io'
import { connectionHandler } from '~~/socket.io/handlers'
import * as middlewares from '~~/socket.io/middleware'
import type { ClientToServerEvents, ServerToClientEvents } from '~~/types/socket.io'

export const io = {} as { server: SocketServer<ClientToServerEvents, ServerToClientEvents> }

export default (nuxtServer: HttpServer) => {
  io.server = new SocketServer(nuxtServer)

  Object.values(middlewares).forEach(({ handler }) => io.server.use(handler))

  io.server.on(connectionHandler.event, connectionHandler.handler as any)
}
