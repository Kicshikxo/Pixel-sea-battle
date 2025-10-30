import type { RoomPlayer, User } from '@prisma/client'
import { defineStore } from 'pinia'
import useRoomStore from '~/store/room'
import useSocketStore from '~/store/socket'

export default defineStore('chat', () => {
  const { socket } = useSocketStore()
  const roomStore = useRoomStore()
  const { session } = useAuth()

  const typingPlayers = ref<(RoomPlayer & { user: User })[]>([])
  const typingTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

  const otherPlayerTyping = computed(() =>
    typingPlayers.value.some((player) => player.user.id !== session.data.value?.id),
  )

  async function startTyping(roomId: string) {
    await new Promise<void>((resolve) =>
      socket.emit('room:chat:typing:start', { roomId }, () => resolve()),
    )
  }

  socket.on('room:chat:typing:start', (player) => {
    const playerExists = typingPlayers.value.some(({ id }) => player.id === id)
    if (!playerExists) {
      typingPlayers.value.push(player)
    }

    if (typingTimeouts.has(player.id)) {
      clearTimeout(typingTimeouts.get(player.id))
      typingTimeouts.delete(player.id)
    }

    typingTimeouts.set(
      player.id,
      setTimeout(() => {
        typingPlayers.value = typingPlayers.value.filter(({ id }) => id !== player.id)
        typingTimeouts.delete(player.id)
      }, 3000),
    )
  })

  async function stopTyping(roomId: string) {
    await new Promise<void>((resolve) =>
      socket.emit('room:chat:typing:stop', { roomId }, () => resolve()),
    )
  }

  socket.on('room:chat:typing:stop', (player) => {
    typingPlayers.value = typingPlayers.value.filter(({ id }) => player.id !== id)

    if (typingTimeouts.has(player.id)) {
      clearTimeout(typingTimeouts.get(player.id))
      typingTimeouts.delete(player.id)
    }
  })

  async function sendMessage(text: string) {
    if (!roomStore.room) return
    return new Promise<void>((resolve) =>
      socket.emit('room:chat:sendMessage', { roomId: roomStore.room!.id, text }, () => resolve()),
    )
  }

  socket.on('room:chat:addMessage', (message) => {
    if (!roomStore.room) return
    roomStore.room.messages = [message, ...roomStore.room.messages]
  })

  return {
    typingPlayers,
    otherPlayerTyping,
    startTyping,
    stopTyping,
    sendMessage,
  }
})
