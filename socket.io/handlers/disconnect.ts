import { Socket } from 'socket.io'

export default {
  event: 'disconnect',
  handler: async (socket) => {},
} as { event: string; handler: (socket: Socket) => void }
