import { Server as HttpServer } from 'node:http'
import { Server as SocketServer } from 'socket.io'
import { connectionHandler } from '~/socket.io/server/socket.io/handlers'
import * as middlewarer from '~/socket.io/server/socket.io/middleware'
import type { ClientToServerEvents, ServerToClientEvents } from '~/socket.io/types'

export const io = {} as { server: SocketServer<ClientToServerEvents, ServerToClientEvents> }

export default (nuxtServer: HttpServer) => {
  io.server = new SocketServer(nuxtServer)

  Object.values(middlewarer).forEach(({ handler }) => io.server.use(handler))

  io.server.on(connectionHandler.event, connectionHandler.handler)
}
