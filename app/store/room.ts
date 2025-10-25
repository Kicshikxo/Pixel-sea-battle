import type {
  Room,
  RoomMessage,
  RoomPlayer,
  RoomPlayerShip,
  RoomPlayerShot,
  User,
} from '@prisma/client'
import { defineStore } from 'pinia'
import { socket } from '~~/socket.io/client'

export default defineStore('room', () => {
  const toast = useToast()
  const { t } = useI18n()

  const room = ref<
    | (Room & {
        messages: (RoomMessage & { user: User })[]
        players: (RoomPlayer & {
          user: User
          ships: RoomPlayerShip[]
          sourceShots: RoomPlayerShot[]
          targetShots: RoomPlayerShot[]
        })[]
      })
    | null
  >(null)

  async function joinRoom(id: string) {
    await new Promise<void>((resolve) =>
      socket.emit('room:join', { id }, (response) => {
        room.value = response ?? null
        resolve()
      }),
    )
  }
  async function leaveRoom(id: string) {
    await new Promise<void>((resolve) =>
      socket.emit('room:leave', { id }, () => {
        room.value = null
        resolve()
      }),
    )
  }

  socket.on('room:playerJoin', (response) => {
    toast.success(t('page.room.playerJoin', { username: response.user.username }))
    console.log('Кто то присоединился', response)
    if (!room.value) return
    room.value.players.push(response)
  })
  socket.on('room:playerLeave', (response) => {
    toast.error(t('page.room.playerLeave', { username: response.user.username }))
    console.log('Кто то отключился', response)
    if (!room.value) return
    room.value.players = room.value.players.filter((player) => player.userId !== response.userId)
  })

  async function sendMessage(text: string) {
    if (!room.value) return
    return new Promise<void>((resolve) =>
      socket.emit('room:chat:sendMessage', { roomId: room.value!.id, text }, () => resolve()),
    )
  }

  socket.on('room:chat:addMessage', (message) => {
    if (room.value) {
      room.value.messages = [message, ...room.value.messages]
    }
  })

  return { room, joinRoom, leaveRoom, sendMessage }
})
