import { Server as HttpServer } from 'node:http'
import { Server as SocketServer } from 'socket.io'
import { connectionHandler } from '~/server/socket.io/handlers'
import * as middleware from '~/server/socket.io/middleware'

export const io = {} as { server: SocketServer }

export default (nuxtServer: HttpServer) => {
  io.server = new SocketServer(nuxtServer)

  Object.values(middleware).forEach(({ handler }) => io.server.use(handler))

  io.server.on(connectionHandler.event, connectionHandler.handler)
}
