import type { Room } from '@prisma/client'
import { defineStore } from 'pinia'
import { socket } from '~/server/socket.io/client'

export default defineStore('socketRoom', () => {
  const room = ref<Room>()

  const messages = ref<string[]>([])

  socket.on('message', (data) => {
    messages.value.push(JSON.stringify(data))
  })

  return { socket, messages }
})
