import { defineEventHandler } from '#imports'
import { Server as SocketServer } from 'socket.io'
import startSocketIOServer from '~/server/socket.io'

export const io = {} as { server: SocketServer }

export default defineEventHandler((event) => {
  if (!io.server) {
    io.server = startSocketIOServer((event.node.req.socket as any)?.server)
  }
})
