import type { RoomMessage, User } from '@prisma/client'
import { prisma } from '~~/prisma/client'
import { io } from '~~/socket.io'
import { SocketHandler } from '~~/types/socket.io'

export default {
  event: 'room:chat:sendMessage',
  handler: async (socket, data, callback) => {
    if (!socket.user) return

    const room = await prisma.room.findUnique({
      where: { id: data.roomId, players: { some: { userId: socket.user.id } } },
    })
    if (!room) return

    const message = await prisma.roomMessage.create({
      data: { roomId: room.id, userId: socket.user?.id, text: data.text },
      include: { user: true },
    })

    io.server.to(data.roomId).emit('room:chat:addMessage', message)

    callback?.(message)
  },
} as SocketHandler<
  'room:chat:sendMessage',
  { roomId: string; text: string },
  RoomMessage & { user: User },
  [
    { event: 'room:chat:addMessage'; data: RoomMessage & { user: User } },
    { event: 'room:chat:removeMessage'; data: RoomMessage & { user: User } },
  ]
>
