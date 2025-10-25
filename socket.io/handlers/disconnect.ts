import { SocketHandler } from '~~/types/socket.io'

export default {
  event: 'disconnect',
  handler: async (socket) => {},
} as SocketHandler<'disconnect'>
