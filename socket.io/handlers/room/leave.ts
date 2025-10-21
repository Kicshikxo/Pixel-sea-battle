import { prisma } from '~~/prisma/client'
import { SocketHandler } from '~~/types/socket.io'

export default {
  event: 'room:leave',
  handler: async (socket, data, callback) => {
    const room = await prisma.room.findUnique({
      where: { id: data.id },
      include: { messages: true },
    })

    if (!room) return

    socket.leave(room.id)

    callback?.()
  },
} as SocketHandler<{ id: string }>
