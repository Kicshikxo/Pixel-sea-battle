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
  socket.on('room:playerConnect', (player) => {
    toast.success(t('page.room.playerConnect', { username: player.user.username }))
    if (!room.value) return
    room.value.players.push(player)
  })

  async function disconnectRoom(roomId: string) {
    await new Promise<void>((resolve) =>
      socket.emit('room:disconnect', { roomId }, () => {
        room.value = null
        resolve()
      }),
    )
  }
  socket.on('room:playerDisconnect', (player) => {
    toast.error(t('page.room.playerDisconnect', { username: player.user.username }))
    if (!room.value) return
    room.value.players = room.value.players.filter(({ userId }) => player.userId !== userId)
  })

  socket.on('room:playerLeave', (player) => {
    if (player.user.id === session.data.value?.id) {
      toast.error(t('page.room.youLeave'))
      room.value = null
    } else {
      toast.error(t('page.room.playerLeave', { username: player.user.username }))
    }
    if (!room.value) return
    room.value.players = room.value.players.filter(({ userId }) => player.userId !== userId)
  })

  return { room, connectRoom, disconnectRoom }
})
