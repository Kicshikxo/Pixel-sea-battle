import { defineEventHandler } from '#imports'
import startSocketIOServer, { io } from '~/server/socket.io'

export default defineEventHandler((event) => {
  if (!io.server) startSocketIOServer((event.node.req.socket as any)?.server)
})
