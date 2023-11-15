import { Server as NuxtServer } from 'node:http'
import { Server } from 'socket.io'
import { connectionHandler } from './handlers'
import * as middleware from './middleware'

export default (nuxtServer: NuxtServer) => {
  const io = new Server(nuxtServer)

  Object.values(middleware).forEach(({ handler }) => io.use(handler))

  io.on(connectionHandler.event, connectionHandler.handler)
}
