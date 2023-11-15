import { Socket } from 'socket.io'

export default {
  event: 'disconnect',
  handler: async (socket) => {
    socket.emit('message', {
      socketId: socket.id,
      status: 'disconnected',
    })
  },
} as { event: string; handler: (socket: Socket) => void }
