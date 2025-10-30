import type {
  GamePlayerShip,
  GamePlayerShot,
  Room,
  RoomMessage,
  RoomPlayer,
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
          ships: GamePlayerShip[]
          sourceShots: GamePlayerShot[]
          targetShots: GamePlayerShot[]
        })[]
      })
    | null
  >(null)

  async function connectRoom(roomId: string) {
    await new Promise<void>((resolve) =>
      socket.emit('room:connect', { roomId }, (response) => {
        room.value = response ?? null
        resolve()
      }),
    )
  }
  socket.on('room:playerConnect', (response) => {
    toast.success(t('page.room.playerConnect', { username: response.user.username }))
    if (!room.value) return
    room.value.players.push(response)
  })

  async function disconnectRoom(roomId: string) {
    await new Promise<void>((resolve) =>
      socket.emit('room:disconnect', { roomId }, () => {
        room.value = null
        resolve()
      }),
    )
  }
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

  return { room, connectRoom, disconnectRoom }
})
