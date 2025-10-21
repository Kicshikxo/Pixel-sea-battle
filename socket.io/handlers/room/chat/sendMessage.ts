import type { RoomMessage } from '@prisma/client'
import { prisma } from '~~/prisma/client'
import { io } from '~~/socket.io'
import { SocketHandler } from '~~/types/socket.io'

export default {
  event: 'room:chat:sendMessage',
  handler: async (socket, data, callback) => {
    if (!socket.user) return

    const message = await prisma.roomMessage.create({
      data: { roomId: data.roomId, userId: socket.user?.id, text: data.text },
    })

    io.server.to(data.roomId).emit('room:chat:addMessage', message)

    callback?.(message)
  },
} as SocketHandler<{ roomId: string; text: string }, RoomMessage>

// as {
//   event: string
//   handler: (
//     socket: Socket,
//     data: { roomId: string; text: string },
//     callback?: (message: RoomMessage) => void,
//   ) => void
// }
