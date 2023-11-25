import { defineStore } from 'pinia'
import { socket } from '~/socket.io/client'

export default defineStore('socket', () => {
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
    socket.emit('initSocket', {}, (data) => {
      console.log(data)
    })
  }

  return { connectSocket, disconnectSocket, reconnectSocket, initSocket }
})
