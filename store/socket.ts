import { defineStore } from 'pinia'
import { socket } from '~/server/socket.io/client'

export default defineStore('socket', () => {
  const messages = ref<string[]>([])

  function connectSocket() {
    socket.connect()
  }

  function disconnectSocket() {
    socket.disconnect()
  }

  function reconnectSocket() {
    disconnectSocket()
    connectSocket()
  }

  function initSocket() {
    socket.emit('initSocket', {}, (data: Object) => {
      messages.value.push(`initSocket: ${JSON.stringify(data)}`)
    })
  }

  socket.on('connect', () => {
    messages.value.push('connected')
  })
  socket.on('disconnect', () => {
    messages.value.push('disconnect')
  })
  socket.on('message', (data) => {
    messages.value.push(`message: ${JSON.stringify(data)}`)
  })

  return { socket, messages, connectSocket, disconnectSocket, reconnectSocket, initSocket }
})
