import startSocketIOServer, { io } from '~/socket.io'

export default defineEventHandler((event) => {
  if (!io.server) startSocketIOServer((event.node.req.socket as any)?.server)
})
