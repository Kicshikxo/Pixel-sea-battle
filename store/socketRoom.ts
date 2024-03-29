import type { Room, RoomMessage } from '@prisma/client'
import { defineStore } from 'pinia'
import { socket } from '~/socket.io/client'

export default defineStore('socketRoom', () => {
  const room = ref<Room | null>(null)
  const messages = ref<RoomMessage[]>([])

  async function joinRoom(id: string) {
    if (process.server) return

    await new Promise<void>((resolve) =>
      socket.emit('room:join', { id }, (response) => {
        room.value = response.room
        messages.value = response.messages.reverse()
        resolve()
      }),
    )
  }
  async function leaveRoom(id: string) {
    if (process.server) return

    await new Promise<void>((resolve) =>
      socket.emit('room:leave', { id }, () => {
        room.value = null
        messages.value = []
        resolve()
      }),
    )
  }

  async function sendMessage(text: string) {
    if (!room.value) return
    return new Promise<RoomMessage>((resolve) => socket.emit('room:chat:sendMessage', { roomId: room.value!.id, text }, resolve))
  }
  socket.on('room:chat:addMessage', (message) => {
    messages.value = [message, ...messages.value]
  })

  return { room, messages, joinRoom, leaveRoom, sendMessage }
})
