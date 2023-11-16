import { Socket } from 'socket.io'
import { prisma } from '../../../prisma/client'
import * as handlers from './index'

export default {
  event: 'connection',
  handler: async (socket) => {
    console.log('connect', socket.id)
    socket.emit('message', {
      socketId: socket.id,
      status: 'connected',
      user: socket.user,
      number: await prisma.user.count(),
    })

    Object.values(handlers).forEach(({ event, handler }) => socket.on(event, (data, callback) => handler(socket, data, callback)))
  },
} as { event: string; handler: (socket: Socket) => void }
