import * as handlers from '~~/socket.io/handlers'
import { SocketHandler } from '~~/types/socket.io'

export default {
  event: 'connection',
  handler: async (socket) => {
    Object.values(handlers).forEach(({ event, handler }) =>
      socket.on(event, (data: any, callback: any) => handler(socket, data, callback)),
    )
  },
} as SocketHandler<'connection'>
