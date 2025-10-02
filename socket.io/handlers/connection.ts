import { Socket } from 'socket.io'
import * as handlers from '~~/socket.io/handlers'

export default {
  event: 'connection',
  handler: async (socket) => {
    Object.values(handlers).forEach(({ event, handler }) =>
      socket.on(event, (data, callback) => handler(socket, data, callback)),
    )
  },
} as { event: string; handler: (socket: Socket) => void }
