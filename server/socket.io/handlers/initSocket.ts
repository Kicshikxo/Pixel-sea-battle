import { Socket } from 'socket.io'
import { authMiddleware } from '~/server/socket.io/middleware'

export default {
  event: 'initSocket',
  handler: async (socket, data, callback) => {
    console.log('init', socket.id)
    socket.emit('message', {
      socketId: socket.id,
      status: 'init',
    })

    authMiddleware.handler(socket)

    callback(socket.user)
  },
} as { event: string; handler: (socket: Socket, data: Object, callback: (response?: Object | null) => void) => void }
