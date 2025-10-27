import type {
  Room,
  RoomMessage,
  RoomPlayer,
  RoomPlayerShip,
  RoomPlayerShot,
  User,
} from '@prisma/client'
import { defineStore } from 'pinia'
import useSocketStore from '~/store/socket'

export default defineStore('room', () => {
  const { socket } = useSocketStore()
  const { session } = useAuth()
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

  async function connectRoom(id: string) {
    await new Promise<void>((resolve) =>
      socket.emit('room:connect', { id }, (response) => {
        room.value = response ?? null
        resolve()
      }),
    )
  }
  async function disconnectRoom(id: string) {
    await new Promise<void>((resolve) =>
      socket.emit('room:disconnect', { id }, () => {
        room.value = null
        resolve()
      }),
    )
  }

  socket.on('room:playerConnect', (response) => {
    toast.success(t('page.room.playerConnect', { username: response.user.username }))
    if (!room.value) return
    room.value.players.push(response)
  })
  socket.on('room:playerDisconnect', (response) => {
    toast.error(t('page.room.playerDisconnect', { username: response.user.username }))
    if (!room.value) return
    room.value.players = room.value.players.filter((player) => player.userId !== response.userId)
  })
  socket.on('room:playerLeave', (response) => {
    if (response.user.id === session.data.value?.id) {
      toast.error(t('page.room.youLeave'))
      room.value = null
    }
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

  return { room, connectRoom, disconnectRoom, sendMessage }
})
