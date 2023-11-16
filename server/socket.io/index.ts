import { Server as HttpServer } from 'node:http'
import { Server as SocketServer } from 'socket.io'
import { connectionHandler } from './handlers'
import * as middleware from './middleware'

export default (nuxtServer: HttpServer) => {
  console.log(`init socket.io: ${!!nuxtServer}`)
  const io = new SocketServer(nuxtServer)

  Object.values(middleware).forEach(({ handler }) => io.use(handler))

  io.on(connectionHandler.event, connectionHandler.handler)

  return io
}
