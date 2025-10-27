import { defineStore } from 'pinia'
import { socket } from '~~/socket.io/client'

export default defineStore('socket', () => {
  const { session } = useAuth()

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

  watchEffect(() => {
    if (session.status.value === 'authenticated') {
      connectSocket()
    } else {
      disconnectSocket()
    }
  })

  return { socket, connectSocket, disconnectSocket, reconnectSocket }
})
