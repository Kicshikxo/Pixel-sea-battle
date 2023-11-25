import { Socket } from 'socket.io'

declare module '~/socket.io/types' {
  interface ClientToServerEvents {
    disconnect: () => void
  }
}

export default {
  event: 'disconnect',
  handler: async (socket) => {},
} as { event: string; handler: (socket: Socket) => void }
