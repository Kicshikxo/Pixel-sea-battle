import type { Room, RoomMessage } from '@prisma/client'
import { defineStore } from 'pinia'
import { socket } from '~/socket.io/client'

export default defineStore('socketRoom', () => {
  const room = ref<Room | null>(null)
  const messages = ref<RoomMessage[]>([])

  async function connectRoom(id: string) {
    socket.emit('room:connect', { id }, (response) => {
      room.value = response.room
      messages.value = response.messages.reverse()
    })
  }

  async function sendMessage(text: string) {
    if (room.value) socket.emit('room:sendMessage', { roomId: room.value.id, text })
  }
  socket.on('room:addMessage', (message) => {
    messages.value = [message, ...messages.value]
  })

  return { room, messages, connectRoom, sendMessage }
})
