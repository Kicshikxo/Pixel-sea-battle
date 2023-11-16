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
      messages.value = [`initSocket: ${JSON.stringify(data)}`, ...messages.value]
    })
  }

  socket.on('connect', () => {
    messages.value = ['connected', ...messages.value]
  })
  socket.on('disconnect', () => {
    messages.value = ['disconnect', ...messages.value]
  })
  socket.on('message', (data) => {
    messages.value = [`message: ${JSON.stringify(data)}`, ...messages.value]
    messages.value.push()
  })

  return { socket, messages, connectSocket, disconnectSocket, reconnectSocket, initSocket }
})
