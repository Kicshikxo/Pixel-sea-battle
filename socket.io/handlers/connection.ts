import * as handlers from '~~/socket.io/handlers'
import type { SocketHandler } from '~~/types/socket.io'

export default {
  event: 'connection',
  handler: async (socket) => {
    if (!socket.user) return

    Object.values(handlers).forEach(({ event, handler }) =>
      socket.on(event, (data: any, callback: any) => handler(socket, data, callback)),
    )

    socket.join(socket.user.id)
  },
} as SocketHandler<'connection'>
